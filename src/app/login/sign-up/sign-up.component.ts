import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '@app/shared';
import { UserAccountService } from '@app/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {

  form: FormGroup;
  success = false;
  signUpError = false;

  constructor(private fb: FormBuilder,
    private userAccountService: UserAccountService) {
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
    this.success = false;
    this.signUpError = false;

    this.userAccountService.createProfessional({ email: this.form.get('email').value })
      .subscribe(
        resp => { this.success = true; },
        err => { this.signUpError = true; }
      );

  }

}
