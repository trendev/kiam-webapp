import { CustomValidators } from '../custom-validators';
import { Component, OnInit, forwardRef, Self, ViewChild, ElementRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  AbstractControl,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
  // providers: [
  //   { provide: NG_VALUE_ACCESSOR, useExisting: PhoneComponent, multi: true },
  //   { provide: NG_VALIDATORS, useExisting: PhoneComponent, multi: true }
  // ]
})
export class PhoneComponent implements ControlValueAccessor, OnInit {

  private _phone: string;
  private _phoneRef: string;

  private _isDisabled = false;

  private _onChanges: any = () => { };
  private _onTouched: any = () => { };

  constructor( @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  ngOnInit() {
    const control = this.controlDir.control;
    const validators = control.validator
      ? [control.validator, CustomValidators.phoneNumber]
      : CustomValidators.phoneNumber;
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  get phone() {
    const val = this._phone.replace(/\s/g, '');
    return /^(((00|\+)\d{2})|0)\d{9}$/.test(val) ?
      val.replace(/^((?:(?:(?:00|\+)\d{2})|0)\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')
      : this._phone;
  }

  set phone(val: string) {
    this._phone = val;
    // avoid to propagate if value and the reference are equal (ex: form reset...)
    if (val !== this._phoneRef) {
      this._onChanges(val.replace(/\s/g, ''));
    }
  }

  writeValue(obj: string): void {
    if (obj) {
      this.phone = obj;
      this._phoneRef = obj;
    }
  }

  registerOnChange(fn: any): void {
    this._onChanges = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  validate(control: AbstractControl) {
    return CustomValidators.phoneNumber(control);
  }

}
