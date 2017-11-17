import { AuthenticationService } from '@app/core';
import { Component, OnInit } from '@angular/core';
import { Professional } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  pro: Professional;
  form: any;

  constructor(private authenticationService: AuthenticationService,
    private fb: FormBuilder) {
    this.pro = new Professional(this.authenticationService.user);
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
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
        genre: this.pro.customerDetails.sex,
        picturePath: new FormControl({ value: this.pro.customerDetails.picturePath, disabled: true }),
        comments: this.fb.array(this.pro.customerDetails.comments)
      })
    });
  }

  save() {
    console.log('save requested...');
    // TODO : implements
  }
}
