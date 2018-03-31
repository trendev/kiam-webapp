import { MatSnackBar } from '@angular/material';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PackService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Business, Offering, OfferingType, Pack } from '@app/entities';
import {
  ErrorAggregatorDirective,
  Utils,
  CustomValidators,
  compareBusinessesFn,
  SuccessMessageComponent,
} from '@app/shared';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { ErrorHandlerService } from '@app/error-handler.service';

@Component({
  selector: 'app-create-pack',
  templateUrl: './create-pack.component.html',
  styleUrls: ['./create-pack.component.scss']
})
export class CreatePackComponent {

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
        businesses: Business[],
        offerings: Offering[]
      }) => {
        this.professionalBusinesses = data.businesses;
        this.professionalOfferings = data.offerings;
        this.form = this.createForm();

        this.form.valueChanges.forEach(_ => {
          if (this.form.invalid && this.errorAggregator) {
            this.errorAggregator.viewContainerRef.clear();
          }
        });

        // default behaviour if only one activity
        this.businesses =
          this.professionalBusinesses.length === 1 ? this.professionalBusinesses.slice() : [];
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
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(125),
        CustomValidators.blankStringForbidden
      ]),
      shortname: new FormControl('', [
        Validators.maxLength(20),
        CustomValidators.blankStringForbidden
      ]),
      price: new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ]),
      duration: new FormControl(1, [
        Validators.required,
        Validators.min(1)
      ]),
      businesses: this.fb.array([], CustomValidators.selectedElementRequired),
      content: this.fb.group({
        offerings: new FormControl([])
      })
    });

    Utils.initFormArray(fg,
      'businesses',
      this.professionalBusinesses,
      b => this.fb.group({
        designation: b.designation,
        // default behaviour if only one activity
        value: this.professionalBusinesses.length === 1 ? true : false
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
    this.packService.create(pack).subscribe(
      _pack => {
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `Forfait ${_pack.name} créé`,
          duration: 2000
        });
        this.router.navigate(['../', { ot: this.ot }], { relativeTo: this.route });
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Impossible de sauvegarder le forfait sur le serveur');
      });
  }

  prepareSave(): Pack {
    const value = this.form.getRawValue();

    const pack = new Pack({
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

}
