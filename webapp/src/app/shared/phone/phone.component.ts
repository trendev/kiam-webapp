import { Utils } from '../utils';
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
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements ControlValueAccessor, OnInit {

  private _isDisabled = false;

  @ViewChild('input') input: ElementRef;

  onChange: any = () => { };
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

  writeValue(val: string): void {
    if (val) {
      this.input.nativeElement.value = Utils.formatPhoneNumber(val);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = (val: string) => {
      this.input.nativeElement.value = Utils.formatPhoneNumber(val);
      fn(Utils.shrinkPhoneNumber(val));
    };
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
