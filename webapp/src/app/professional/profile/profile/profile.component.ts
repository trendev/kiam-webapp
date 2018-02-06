import {
  AuthenticationService,
  BusinessService,
  PaymentModeService,
  ProfessionalService
} from '@app/core';
import { Component, ViewContainerRef, ViewChild, OnInit } from '@angular/core';
import { Professional, Address, CustomerDetails, Business, PaymentMode } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import * as moment from 'moment';
import {
  ErrorAggregatorDirective,
  CustomValidators,
  Utils,
  compareBusinessesFn,
  comparePaymentModesFn,
  ProfileRefreshedComponent,
  ProfileSavedComponent
} from '@app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/finally';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  pro: Professional;
  form: FormGroup;
  private businesses: Business[];
  private paymentModes: PaymentMode[];

  private commentsValidators = [
    Validators.required,
    CustomValidators.blankStringForbidden,
    Validators.maxLength(200)
  ];

  @ViewChild(ErrorAggregatorDirective) errorAggregator: ErrorAggregatorDirective;

  constructor(private authenticationService: AuthenticationService,
    private professionalService: ProfessionalService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar) {
    this.pro = new Professional(this.authenticationService.user);
    this.route.data.subscribe(
      (data: {
        businesses: Business[],
        paymentModes: PaymentMode[]
      }) => {
        this.businesses = data.businesses;
        this.paymentModes = data.paymentModes;
        this.form = this.createForm();
      }
    );
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
      accountInfo: this.fb.group({
        uuid: new FormControl({ value: this.pro.uuid, disabled: true }),
        registrationDate: new FormControl({
          value: this.pro.registrationDate
            ? moment(this.pro.registrationDate) : undefined,
          disabled: true
        }),
        username: new FormControl(this.pro.username, [
          Validators.required,
          Validators.maxLength(20),
          CustomValidators.whiteSpaceForbidden
        ])
      }),
      address: this.fb.group({
        street: new FormControl(this.pro.address.street, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(100)
        ]),
        optional: new FormControl(this.pro.address.optional, [
          CustomValidators.blankStringForbidden,
          Validators.maxLength(100)
        ]),
        postalCode: new FormControl(this.pro.address.postalCode, [
          Validators.required,
          CustomValidators.whiteSpaceForbidden,
          Validators.maxLength(5),
          Validators.minLength(5)
        ]),
        city: new FormControl(this.pro.address.city, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(75)
        ]),
        country: new FormControl({ value: this.pro.address.country, disabled: true })
      }),
      customerDetails: this.fb.group({
        firstName: new FormControl(this.pro.customerDetails.firstName, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(50)
        ]),
        lastName: new FormControl(this.pro.customerDetails.lastName, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(50)
        ]),
        nickname: new FormControl(this.pro.customerDetails.nickname, [
          CustomValidators.blankStringForbidden,
          Validators.maxLength(50)
        ]),
        phone: new FormControl(this.pro.customerDetails.phone, [
          Validators.required,
          CustomValidators.phoneNumber
        ]
        ),
        birthdate: new FormControl(
          this.pro.customerDetails.birthdate ? moment(this.pro.customerDetails.birthdate) : undefined, [
            CustomValidators.adultOnly
          ]),
        sex: this.pro.customerDetails.sex,
        picturePath: new FormControl({ value: this.pro.customerDetails.picturePath, disabled: true }),
        comments: this.fb.array(
          this.pro.customerDetails.comments || [],
          CustomValidators.validComments(this.commentsValidators))
      }),
      businesses: this.fb.array([], CustomValidators.selectedElementRequired),
      paymentModes: this.fb.array([], CustomValidators.selectedElementRequired),
      companyInformation: this.fb.group({
        website: new FormControl(this.pro.website, [
          CustomValidators.blankStringForbidden,
          Validators.maxLength(150)
        ]),
        companyName: new FormControl(this.pro.companyName, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(50)
        ]),
        companyCodes: this.fb.group({
          companyID: new FormControl(this.pro.companyID, [
            Validators.required,
            CustomValidators.validCompanyID
          ]),
          vatcode: new FormControl(this.pro.vatcode, [
            CustomValidators.validVatCode
          ])
        }, { validator: CustomValidators.validVatCodeFromCompanyID }),
        creationDate: new FormControl(this.pro.creationDate ? moment(this.pro.creationDate) : undefined, [
          Validators.required,
          CustomValidators.past
        ])
      }),
      socialNetworkAccounts: this.fb.group({
        facebook: new FormControl(this.pro.socialNetworkAccounts.facebook, [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ]),
        twitter: new FormControl(this.pro.socialNetworkAccounts.twitter, [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ]),
        instagram: new FormControl(this.pro.socialNetworkAccounts.instagram, [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ]),
        pinterest: new FormControl(this.pro.socialNetworkAccounts.pinterest, [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ])
      })
    });

    Utils.initFormArray(fg,
      'businesses',
      this.businesses,
      b => this.fb.group({
        designation: b.designation,
        value: this.pro.businesses
          ? this.pro.businesses.findIndex(_b => _b.designation === b.designation) !== -1
          : false
      }),
      compareBusinessesFn);

    Utils.initFormArray(fg,
      'paymentModes',
      this.paymentModes,
      pm => this.fb.group({
        name: pm.name,
        value: this.pro.paymentModes
          ? this.pro.paymentModes.findIndex(_pm => _pm.name === pm.name) !== -1
          : false
      }),
      comparePaymentModesFn);

    return fg;
  }

  revert() {
    // resets the form field based on the raw value, value alone will ignore disabled field (uuid,registrationDate...)
    this.form.reset(this.createForm().getRawValue());

    // rebuilds the controls of the comments group if they have been modified/removed
    const customerDetailsFG = this.form.get('customerDetails') as FormGroup;
    customerDetailsFG.setControl('comments', this.fb.array(
      this.pro.customerDetails.comments || [], CustomValidators.validComments(this.commentsValidators)));
  }

  save() {
    const pro = this.prepareSave();

    // saves the non-mutable fields
    pro.email = this.pro.email;
    pro.cltype = this.pro.cltype;
    // ignores password
    pro.uuid = this.pro.uuid;
    pro.registrationDate = this.pro.registrationDate;
    pro.blocked = this.pro.blocked;

    this.loadingOverlayService.start();
    this.professionalService.put(pro)
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
      _pro => {
        this.pro = _pro;
        this.authenticationService.user = _pro;
        this.revert(); // reset the controls (pristine, untouched...)
        this.snackBar.openFromComponent(ProfileSavedComponent, { duration: 2000 });
      },
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de sauvegarder les modifications du profile')
      );
  }

  prepareSave(): Professional {
    const value = this.form.getRawValue();

    const pro = new Professional({
      password: undefined,
      username: value.accountInfo.username || undefined,
      website: value.companyInformation.website || undefined,
      companyName: value.companyInformation.companyName || undefined,
      companyID: value.companyInformation.companyCodes.companyID || undefined,
      vatcode: value.companyInformation.companyCodes.vatcode || undefined,
      creationDate: value.companyInformation.creationDate ? value.companyInformation.creationDate.valueOf() : undefined,
      address: {
        street: value.address.street || undefined,
        optional: value.address.optional || undefined,
        postalCode: value.address.postalCode || undefined,
        city: value.address.city || undefined,
        country: value.address.country || undefined
      },
      customerDetails: {
        firstName: value.customerDetails.firstName || undefined,
        lastName: value.customerDetails.lastName || undefined,
        nickname: value.customerDetails.nickname || undefined,
        phone: value.customerDetails.phone || undefined,
        birthdate: value.customerDetails.birthdate ? value.customerDetails.birthdate.valueOf() : undefined,
        sex: value.customerDetails.sex || undefined,
        picturePath: value.customerDetails.picturePath || undefined,
        comments: value.customerDetails.comments || undefined
      },
      socialNetworkAccounts: {
        facebook: value.socialNetworkAccounts.facebook || undefined,
        twitter: value.socialNetworkAccounts.twitter || undefined,
        instagram: value.socialNetworkAccounts.instagram || undefined,
        pinterest: value.socialNetworkAccounts.pinterest || undefined
      },
      businesses: Utils.extractArrayFromControl(this.form, 'businesses',
        fg => new Business({
          designation: fg.value.designation
        })
      ),
      paymentModes: Utils.extractArrayFromControl(this.form, 'paymentModes',
        fg => new PaymentMode({
          name: fg.value.name
        })
      )
    });

    return pro;
  }

  refresh() {
    this.loadingOverlayService.start();
    this.professionalService.profile(true)
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
      _pro => {
        this.pro = _pro;
        this.authenticationService.user = _pro;
        this.revert(); // reset the controls (pristine, untouched...)
        this.snackBar.openFromComponent(ProfileRefreshedComponent, { duration: 2000 });
      },
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de rafraîchir le profil à partir du serveur')
      );
  }
}
