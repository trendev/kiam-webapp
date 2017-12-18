import { CustomValidators } from './../../../shared/custom-validators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Pack, Offering, Business, OfferingType } from '@app/entities';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { PackService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorAggregatorDirective } from '@app/shared';

@Component({
  selector: 'app-pack-detail',
  templateUrl: './pack-detail.component.html',
  styleUrls: ['./pack-detail.component.scss']
})
export class PackDetailComponent implements OnInit {

  pack: Pack;
  parentPacks: Pack[];
  offerings: Offering[]; // the professional's offerings
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
        pack: Pack,
        parentPacks: Pack[],
        businesses: Business[]
      }) => {
        this.pack = data.pack;
        this.parentPacks = data.parentPacks;
        this.businesses = data.businesses;
        this.form = this.createForm();
      });
  }

  ngOnInit() {
    this.form.valueChanges.forEach(_ => {
      if (this.form.invalid && this.errorAggregator) {
        this.errorAggregator.viewContainerRef.clear();
      }
    });
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      name: new FormControl(this.pack.name, [
        Validators.required,
        Validators.maxLength(50),
        CustomValidators.blankStringForbidden
      ]),
      // price unit is 1/100 EUR !
      price: new FormControl(this.pack.price / 100, [
        Validators.required,
        Validators.min(1)
      ]),
      duration: new FormControl(this.pack.duration, [
        Validators.required,
        Validators.min(1)
      ]),
      businesses: this.fb.array([], CustomValidators.selectedElementRequired),
    });

    const businessesFA = fg.get('businesses') as FormArray;
    this.businesses.forEach(b =>
      businessesFA.push(this.fb.group({
        designation: b.designation,
        value: this.pack.businesses
          ? this.pack.businesses.findIndex(_b => _b.designation === b.designation) !== -1
          : false
      })));

    return fg;
  }

  revert() {

  }

  save() {

  }
}
