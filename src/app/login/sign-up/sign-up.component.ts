import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {

  form: FormGroup;
  email: string;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.fb.group({
      email: '', // TODO : add email validator
    });
  }

  reset() {
    this.form.reset();
  }

  createAccount() {
    this.email = this.form.get('email').value;
  }

}
