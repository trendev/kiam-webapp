import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ]),
      confirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ])
    });
  }

  generate() {

  }

  save() {

  }

  revert() {
    this.form.reset();
  }

}
