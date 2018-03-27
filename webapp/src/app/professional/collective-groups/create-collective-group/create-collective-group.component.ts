import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  ErrorAggregatorDirective,
  CustomValidators,
  CollectiveGroupCreatedComponent
} from '@app/shared';
import { CollectiveGroupService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar } from '@angular/material';
import { ErrorHandlerService } from '@app/error-handler.service';
import { CollectiveGroup } from '@app/entities';

@Component({
  selector: 'app-create-collective-group',
  templateUrl: './create-collective-group.component.html',
  styleUrls: ['./create-collective-group.component.scss']
})
export class CreateCollectiveGroupComponent implements OnInit {
  form: FormGroup;

  @ViewChild(ErrorAggregatorDirective) errorAggregator: ErrorAggregatorDirective;

  constructor(private fb: FormBuilder,
    private collectiveGroupService: CollectiveGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) {
    this.form = this.createForm();
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
      groupName: new FormControl('', [
        Validators.required,
        CustomValidators.blankStringForbidden,
        Validators.maxLength(50)
      ]),
      phone: new FormControl('', [
        Validators.required,
        CustomValidators.phoneNumber
      ]
      ),
      address: this.fb.group({
        street: new FormControl('', [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(100)
        ]),
        optional: new FormControl('', [
          CustomValidators.blankStringForbidden,
          Validators.maxLength(100)
        ]),
        postalCode: new FormControl('', [
          Validators.required,
          CustomValidators.whiteSpaceForbidden,
          Validators.maxLength(5),
          Validators.minLength(5)
        ]),
        city: new FormControl('', [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(75)
        ]),
        country: new FormControl({ value: 'France', disabled: true })
      }),
    });

    return fg;
  }

  revert() {
    // resets the form field based on the raw value, value alone will ignore disabled field (uuid,registrationDate...)
    this.form.reset(this.createForm().getRawValue());
  }

  prepareSave(): CollectiveGroup {
    const value = this.form.getRawValue();

    const cg = new CollectiveGroup({
      groupName: value.groupName || undefined,
      phone: value.phone || undefined,
      address: {
        street: value.address.street || undefined,
        optional: value.address.optional || undefined,
        postalCode: value.address.postalCode || undefined,
        city: value.address.city || undefined,
        country: value.address.country || undefined
      }
    });

    return cg;
  }

  save() {
    const cg = this.prepareSave();
    this.loadingOverlayService.start();
    this.collectiveGroupService.create(cg).subscribe(
      _cg => {
        this.snackBar.openFromComponent(CollectiveGroupCreatedComponent, {
          data: _cg,
          duration: 2000
        });
        this.router.navigate(['../', _cg.id], { relativeTo: this.route });
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Impossible de sauvegarder le nouveau Groupe sur le serveur');
      });
  }

}
