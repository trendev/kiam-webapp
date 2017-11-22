import { AuthenticationService } from '@app/core';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  form: FormGroup;

  @Output()
  newpwd: EventEmitter<string> = new EventEmitter();

  constructor(
    private authenticationService: AuthenticationService,
    private fb: FormBuilder) {
    this.createForm();
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
    } else {
      console.warn('Les mots de passse ne sont pas identiques...');
    }
  }

  revert() {
    this.form.reset();
  }

}
