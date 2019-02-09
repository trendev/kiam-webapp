import { MatSnackBar } from '@angular/material';
import { Component, ViewChild } from '@angular/core';
import { Pack, Offering, Business, OfferingType } from '@app/entities';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { PackService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ErrorAggregatorDirective,
  CustomValidators,
  Utils,
  compareBusinessesFn,
  SuccessMessageComponent,
} from '@app/shared';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { ErrorHandlerService } from '@app/error-handler.service';

@Component({
  selector: 'app-pack-detail',
  templateUrl: './pack-detail.component.html',
  styleUrls: ['./pack-detail.component.scss']
})
export class PackDetailComponent {

  pack: Pack;
  parentPacks: Pack[];
  professionalOfferings: Offering[]; // the professional's offerings
  professionalBusinesses: Business[];
  businesses: Business[];

  form: FormGroup;

  readonly ot = OfferingType.PACK;

  @ViewChild(ErrorAggregatorDirective) errorAggregator: ErrorAggregatorDirective;

  constructor(private fb: FormBuilder,
    private packService: PackService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) {
    this.route.data.subscribe(
      (data: {
        pack: Pack,
        parentPacks: Pack[],
        businesses: Business[],
        offerings: Offering[]
      }) => {
        this.pack = data.pack;
        this.parentPacks = data.parentPacks;
        this.professionalBusinesses = data.businesses;
        this.professionalOfferings = data.offerings
          .filter(o => o.id !== this.pack.id) // filter itself
          .filter(o => this.parentPacks.findIndex(p => p.id === o.id) === -1); // filter parent packs
        this.form = this.createForm();

        this.form.valueChanges.forEach(_ => {
          if (this.form.invalid && this.errorAggregator) {
            this.errorAggregator.viewContainerRef.clear();
          }
        });

        this.businesses = this.pack.businesses
          // avoid to display offerings associated to businesses which are not performed by the professional
          .filter(b => this.professionalBusinesses.findIndex(_b => _b.designation === b.designation) !== -1);
        this.setBusinessesValueChanges();
      });
  }

  /**
   * Set the businesses each time a business is checked/unchecked in the businesses panel
   */
  setBusinessesValueChanges() {
    this.form.get('businesses').valueChanges
      .subscribe(val => this.businesses = Utils.extractArrayFromControl(this.form, 'businesses',
        fg => new Business({
          designation: fg.value.designation
        })
      ));
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      name: new FormControl(this.pack.name, [
        Validators.required,
        Validators.maxLength(125),
        CustomValidators.blankStringForbidden
      ]),
      shortname: new FormControl(this.pack.shortname || '', [
        Validators.maxLength(20),
        CustomValidators.blankStringForbidden
      ]),
      // price unit is 1/100 EUR !
      price: new FormControl(this.pack.price / 100, [
        Validators.required,
        Validators.min(0)
      ]),
      duration: new FormControl(this.pack.duration, [
        Validators.required,
        Validators.min(1)
      ]),
      businesses: this.fb.array([], CustomValidators.selectedElementRequired),
      content: this.fb.group({
        offerings: new FormControl(this.pack.offerings ? this.pack.offerings.slice() : [])
      })
    });

    Utils.initFormArray(fg,
      'businesses',
      this.professionalBusinesses,
      b => this.fb.group({
        designation: b.designation,
        value: this.pack.businesses
          ? this.pack.businesses.findIndex(_b => _b.designation === b.designation) !== -1
          : false
      }),
      compareBusinessesFn);

    return fg;
  }

  revert() {
    // resets the form field based on the raw value
    this.form.reset(this.createForm().getRawValue());
  }

  save() {
    const pack = this.prepareSave();
    this.loadingOverlayService.start();
    this.packService.update(pack).subscribe(
      _pack => {
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `Forfait ${_pack.name} mis à jour`,
          duration: 2000
        });
        this.router.navigate(['../../', { ot: this.ot }], { relativeTo: this.route });
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Impossible de sauvegarder le forfait sur le serveur');
      });
  }

  prepareSave(): Pack {
    const value = this.form.getRawValue();

    const pack = new Pack({
      id: this.pack.id,
      name: value.name,
      shortname: value.shortname,
      price: Math.round(value.price * 100),
      duration: value.duration,
      businesses: Utils.extractArrayFromControl(this.form, 'businesses',
        fg => new Business({
          designation: fg.value.designation
        })
      ),
      offerings: value.content.offerings.slice()
    });

    return pack;
  }

  remove() {
    this.loadingOverlayService.start();
    this.packService.remove(this.pack.id).subscribe(
      resp => {
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `Forfait ${this.pack.name} supprimé`,
          duration: 2000
        });
        this.router.navigate(['../../', { ot: this.ot }], { relativeTo: this.route });
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Impossible de supprimer le forfait sur le serveur');
      });
  }
}
