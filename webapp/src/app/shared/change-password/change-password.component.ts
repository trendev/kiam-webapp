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
