import { CustomValidators } from './../custom-validators';
import { AuthenticationService } from '@app/core';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import 'rxjs/add/operator/finally';

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
    private loadingOverlayService: LoadingOverlayService) {
    this.createForm();
  }

  ngOnInit() {
    // TODO : checks for each modification of the field confirmation if confirmation === password
  }


  createForm() {
    this.form = this.fb.group({
      password: new FormControl('', this.validators),
      confirmation: new FormControl('', this.validators)
    },
      {
        validator: passwordMatchValidator()
      });
  }

  generate() {
    this.loadingOverlayService.start();
    this.authenticationService.password()
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
      pwd => {
        this.form.setValue({
          password: pwd,
          confirmation: pwd
        });
        this.form.markAsDirty();
      },
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de générer un mot de passe depuis le serveur')
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
    } else {
      console.warn('Les mots de passse ne sont pas identiques...');
    }
  }

  revert() {
    this.form.reset();
  }

}

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
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
}
