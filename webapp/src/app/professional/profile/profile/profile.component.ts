import { AuthenticationService, BusinessService, PaymentModeService } from '@app/core';
import { Component, OnInit } from '@angular/core';
import { Professional } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  pro: Professional;
  form: FormGroup;

  constructor(private authenticationService: AuthenticationService,
    private businessService: BusinessService,
    private paymentModeService: PaymentModeService,
    private fb: FormBuilder) {
    this.pro = new Professional(this.authenticationService.user);
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      accountInfo: this.fb.group({
        uuid: new FormControl({ value: this.pro.uuid, disabled: true }),
        registrationDate: new FormControl({ value: new Date(this.pro.registrationDate), disabled: true }),
        username: [this.pro.username, Validators.required]
      }),
      address: this.fb.group({
        street: [this.pro.address.street, Validators.required],
        optional: this.pro.address.optional,
        postalCode: [this.pro.address.postalCode, Validators.required],
        city: [this.pro.address.city, Validators.required],
        country: new FormControl({ value: this.pro.address.country, disabled: true })
      }),
      customerDetails: this.fb.group({
        firstName: [this.pro.customerDetails.firstName, Validators.required],
        lastName: [this.pro.customerDetails.lastName, Validators.required],
        nickname: this.pro.customerDetails.nickname,
        phone: [this.pro.customerDetails.phone, [
          Validators.minLength(10),
          Validators.maxLength(14),
          Validators.required]
        ],
        birthdate: new Date(this.pro.customerDetails.birthdate),
        sex: this.pro.customerDetails.sex,
        picturePath: new FormControl({ value: this.pro.customerDetails.picturePath, disabled: true }),
        comments: this.fb.array(this.pro.customerDetails.comments)
      }),
      businesses: this.fb.array([]),
      paymentModes: this.fb.array([]),
      companyInformation: this.fb.group({
        website: this.pro.website,
        companyName: this.pro.companyName,
        companyID: this.pro.companyID,
        VATcode: this.pro.VATcode,
        creationDate: new Date(this.pro.creationDate)
      }),
      socialNetworkAccounts: this.fb.group({
        facebook: this.pro.socialNetworkAccounts.facebook,
        twitter: this.pro.socialNetworkAccounts.twitter,
        instagram: this.pro.socialNetworkAccounts.instagram,
        pinterest: this.pro.socialNetworkAccounts.pinterest
      })
    });

    this.businessService.businesses.subscribe(
      businesses => {
        const businessesFA = fg.get('businesses') as FormArray;
        businesses.forEach(b =>
          businessesFA.push(this.fb.group({
            designation: b.designation,
            value: this.pro.businesses.findIndex(_b => _b.designation === b.designation) !== -1
          })));
      },
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de charger les activités depuis le serveur')
    );

    this.paymentModeService.paymentModes.subscribe(
      paymentModes => {
        const paymentModesFA = fg.get('paymentModes') as FormArray;
        paymentModes.forEach(pm =>
          paymentModesFA.push(this.fb.group({
            name: pm.name,
            value: this.pro.paymentModes.findIndex(_pm => _pm.name === pm.name) !== -1
          })));
      },
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de charger les activités depuis le serveur')
    );

    return fg;
  }

  ngOnInit() {
  }

  save() {
    console.log(`save()`);
  }

  revert() {
    // rebuilds the controls of the comments group if they have been modified/removed
    const customerDetailsFG = this.form.get('customerDetails') as FormGroup;
    customerDetailsFG.setControl('comments', this.fb.array(this.pro.customerDetails.comments));

    // resets the form field based on the raw value, value alone will ignore disabled field (uuid,registrationDate...)
    this.form.reset(this.createForm().getRawValue());

  }
}
