import { AuthenticationService } from '@app/core';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

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

  constructor(
    private authenticationService: AuthenticationService,
    private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    // TODO : checks for each modification of the field confirmation if confirmation === password
  }

  createForm() {
    this.form = this.fb.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('[^\\s]+$')// no white space
      ]),
      confirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('[^\\s]+$')// no white space
      ])
    },
      {
        validator: passwordMatchValidator()
      });
  }

  generate() {
    this.authenticationService.password().subscribe(
      pwd => {
        this.form.get('password').setValue(pwd, { emitEvent: true });
        this.form.get('password').markAsDirty();
        this.form.get('confirmation').setValue(pwd, { emitEvent: true });
        this.form.get('confirmation').markAsDirty();
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
    return (control.get('password').value !== control.get('confirmation').value) ? { invalidPassword: true } : null;
  };
}
