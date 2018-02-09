import { Component, OnInit, ViewChild } from '@angular/core';
import { Service, Pack, Business, OfferingType, Offering } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  ErrorAggregatorDirective,
  CustomValidators,
  Utils,
  compareBusinessesFn,
  ServiceUpdatedComponent,
  ServiceRemovedComponent
} from '@app/shared';
import { ServiceService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent {

  service: Service;
  parentPacks: Pack[];
  professionalBusinesses: Business[];

  form: FormGroup;

  readonly ot = OfferingType.SERVICE;

  @ViewChild(ErrorAggregatorDirective) errorAggregator: ErrorAggregatorDirective;

  constructor(private fb: FormBuilder,
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar) {
    this.route.data.subscribe(
      (data: {
        service: Service;
        parentPacks: Pack[];
        businesses: Business[]
      }) => {
        this.service = data.service;
        this.parentPacks = data.parentPacks;
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
      name: new FormControl(this.service.name, [
        Validators.required,
        Validators.maxLength(125),
        CustomValidators.blankStringForbidden
      ]),
      shortname: new FormControl(this.service.shortname || '', [
        Validators.maxLength(20),
        CustomValidators.blankStringForbidden
      ]),
      // price unit is 1/100 EUR !
      price: new FormControl(this.service.price / 100, [
        Validators.required,
        Validators.min(0)
      ]),
      duration: new FormControl(this.service.duration, [
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
        value: this.service.businesses
          ? this.service.businesses.findIndex(_b => _b.designation === b.designation) !== -1
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
    const service = this.prepareSave();
    this.loadingOverlayService.start();
    this.serviceService.update(service).subscribe(
      _service => {
        this.snackBar.openFromComponent(ServiceUpdatedComponent, {
          data: _service,
          duration: 2000
        });
        this.router.navigate(['../../', { ot: this.ot }], { relativeTo: this.route });
      },
      // TODO: handle this (check the status code, etc)
      e => {
        this.loadingOverlayService.stop();
        console.error('Impossible de sauvegarder la prestation sur le serveur');
      });
  }

  prepareSave(): Service {
    const value = this.form.getRawValue();

    const service = new Service({
      id: this.service.id,
      name: value.name,
      shortname: value.shortname,
      price: value.price * 10 * 10,
      duration: value.duration,
      businesses: Utils.extractArrayFromControl(this.form, 'businesses',
        fg => new Business({
          designation: fg.value.designation
        })
      )
    });

    return service;
  }

  remove() {
    this.loadingOverlayService.start();
    this.serviceService.remove(this.service.id).subscribe(
      resp => {
        this.snackBar.openFromComponent(ServiceRemovedComponent, { duration: 2000 });
        this.router.navigate(['../../', { ot: this.ot }], { relativeTo: this.route });
      },
      // TODO: handle this (check the status code, etc)
      e => {
        this.loadingOverlayService.stop();
        console.error('Impossible de supprimer la prestation sur le serveur');
      });
  }

}
