import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '@app/shared';
import { UserAccountService } from '@app/core';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {

  form: FormGroup;
  success = false;
  signUpError = false;
  signUpConflict = false;

  constructor(private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private loadingOverlayService: LoadingOverlayService) {
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

  getInputEmail(): string {
    return `${this.form.get('email').value}`;
  }

  createAccount() {
    this.loadingOverlayService.start();

    this.success = this.signUpError = this.signUpConflict = false;

    const email = this.form.get('email').value as string;

    this.userAccountService.createProfessional({ email: email.trim() })
      .pipe(
        finalize(() => this.loadingOverlayService.stop()))
      .subscribe(
        resp => { this.success = true; },
        err => {
          if (err instanceof HttpErrorResponse
            && err.status === 409
            && err.statusText === 'Conflict') {
            this.signUpConflict = true;
          } else {
            this.signUpError = true;
          }
        }
      );

  }

}
