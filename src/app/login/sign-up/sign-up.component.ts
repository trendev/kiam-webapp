import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '@app/shared';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {

  form: FormGroup;
  success = false;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        CustomValidators.email
      ]),
    });
  }

  createAccount() {
    const email = this.form.get('email').value;
    const payload = {
      email: email
    };

    this.success = true;
  }

}
