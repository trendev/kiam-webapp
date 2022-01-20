
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from './../../core/authentication.service';
import { CustomValidators } from './../custom-validators';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { LoadingOverlayService } from '@app/loading-overlay.service';

import { ErrorHandlerService } from '@app/error-handler.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  hide: boolean;

  form: FormGroup;

  @Output()
  newpwd: EventEmitter<string> = new EventEmitter();

  validators = [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(4096),
    CustomValidators.whiteSpaceForbidden
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private loadingOverlayService: LoadingOverlayService,
    private errorHandler: ErrorHandlerService) {
    this.createForm();
  }

  ngOnInit() {
  }


  createForm() {
    this.form = this.fb.group({
      password: new FormControl('', this.validators),
      confirmation: new FormControl('', this.validators)
    },
      {
        validators: passwordMatchValidator
      });
  }

  generate() {
    this.loadingOverlayService.start();
    this.authenticationService.password().pipe(
      finalize(() => this.loadingOverlayService.stop()))
      .subscribe(
        pwd => {
          this.form.setValue({
            password: pwd,
            confirmation: pwd
          });
          this.form.markAsDirty();
        },
        e => this.errorHandler.handle(e, 'Impossible de générer un mot de passe depuis le serveur')
      );
  }

  save() {
    const value = this.form.value;
    if (value.password === value.confirmation) {
      this.newpwd.emit(value.password);

      // resets the form with the current password/confirmation
      const password = value.password;
      const confirmation = value.confirmation;
      this.form.reset({
        password: password,
        confirmation: confirmation
      });
    }
  }

  revert() {
    this.form.reset();
  }

}

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.get('password').value !== control.get('confirmation').value) {
    return {
      passwordMatchValidator: {
        password: control.get('password').value,
        confirmation: control.get('confirmation').value
      }
    };
  } else {
    return null;
  }
};

