import {
  AuthenticationService,
  BusinessService,
  PaymentModeService,
  ProfessionalService
} from '@app/core';
import { Component } from '@angular/core';
import { Professional, Address, CustomerDetails, Business, PaymentMode } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Moment } from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  pro: Professional;
  form: FormGroup;

  constructor(private authenticationService: AuthenticationService,
    private businessService: BusinessService,
    private paymentModeService: PaymentModeService,
    private professionalService: ProfessionalService,
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
        vatcode: this.pro.vatcode,
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

  revert() {
    // rebuilds the controls of the comments group if they have been modified/removed
    const customerDetailsFG = this.form.get('customerDetails') as FormGroup;
    customerDetailsFG.setControl('comments', this.fb.array(this.pro.customerDetails.comments));

    // resets the form field based on the raw value, value alone will ignore disabled field (uuid,registrationDate...)
    this.form.reset(this.createForm().getRawValue());

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

    this.professionalService.put(pro).subscribe(
      _pro => {
        this.pro = _pro;
        this.authenticationService.user = _pro;
        this.revert(); // reset the controls (pristine, untouched...)
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
      companyID: value.companyInformation.companyID || undefined,
      vatcode: value.companyInformation.vatcode || undefined,
      creationDate: value.companyInformation.creationDate.valueOf() || undefined,
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
        birthdate: value.customerDetails.birthdate.valueOf() || undefined,
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
      businesses: this.extractArrayFromControl('businesses',
        fg => new Business({
          designation: fg.value.designation
        })
      ),
      paymentModes: this.extractArrayFromControl('paymentModes',
        fg => new PaymentMode({
          name: fg.value.name
        })
      )
    });

    return pro;
  }

  private extractArrayFromControl(faName: string, mapperFn: (fg: FormGroup) => any) {
    const fa = this.form.get(faName) as FormArray;
    return fa.controls.filter(fg => fg.value.value).map(mapperFn);
  }

  refresh() {
    this.professionalService.profile().subscribe(
      _pro => {
        this.pro = _pro;
        this.authenticationService.user = _pro;
        this.revert(); // reset the controls (pristine, untouched...)
      },
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de rafraîchir le profil à partir du serveur')
    );
  }
}
