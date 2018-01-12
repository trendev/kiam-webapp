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
  styleUrls: ['./phone.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: PhoneComponent, multi: true },
  ]
})
export class PhoneComponent implements ControlValueAccessor {

  private _isDisabled = false;

  @ViewChild('input') input: ElementRef;

  onChange: any = () => { };
  private _onTouched: any = () => { };

  constructor() {
  }

  writeValue(val: string): void {
    this.input.nativeElement.value = Utils.formatPhoneNumber(val);
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
