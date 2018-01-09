import { Component, OnInit, ViewChild } from '@angular/core';
import { Business, OfferingType, Service } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ErrorAggregatorDirective, CustomValidators, Utils, compareBusinessesFn } from '@app/shared';
import { ServiceService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent {

  professionalBusinesses: Business[];

  form: FormGroup;

  readonly ot = OfferingType.SERVICE;

  @ViewChild(ErrorAggregatorDirective) errorAggregator: ErrorAggregatorDirective;

  constructor(private fb: FormBuilder,
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.data.subscribe(
      (data: {
        businesses: Business[]
      }) => {
        this.professionalBusinesses = data.businesses;

        this.form = this.createForm();

        this.form.valueChanges.forEach(_ => {
          if (this.form.invalid && this.errorAggregator) {
            this.errorAggregator.viewContainerRef.clear();
          }
        });

      });
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
      businesses: this.fb.array([], CustomValidators.selectedElementRequired)
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
    const service = this.prepareSave();
    this.serviceService.create(service).subscribe(
      _service => this.router.navigate(['../', { ot: this.ot }], { relativeTo: this.route }),
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de sauvegarder la prestation sur le serveur')
    );
  }

  prepareSave(): Service {
    const value = this.form.getRawValue();

    const service = new Service({
      name: value.name,
      shortname: value.shortname,
      price: value.price * 100,
      duration: value.duration,
      businesses: Utils.extractArrayFromControl(this.form, 'businesses',
        fg => new Business({
          designation: fg.value.designation
        })
      )
    });

    return service;
  }
}
