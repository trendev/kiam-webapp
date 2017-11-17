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
    this.form = this.fb.group({
      accountInfo: this.fb.group({
        uuid: new FormControl({ value: this.pro.uuid, disabled: true }),
        registrationDate: new FormControl({ value: new Date(this.pro.registrationDate), disabled: true }),
        username: [this.pro.username, Validators.required]
      })
    });
  }

  save() {
    console.log('save requested...');
    // TODO : implements
  }
}
