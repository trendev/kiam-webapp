import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PackService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Business, Offering, OfferingType } from '@app/entities';
import { ErrorAggregatorDirective, Utils, CustomValidators, compareBusinessesFn } from '@app/shared';

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
    private route: ActivatedRoute) {
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

        this.businesses = [];
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
        Validators.maxLength(75),
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
        value: false
      }),
      compareBusinessesFn);

    return fg;
  }

  revert() {
    // resets the form field based on the raw value
    this.form.reset(this.createForm().getRawValue());
  }

}
