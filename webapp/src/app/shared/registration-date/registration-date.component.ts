import { Component, OnInit, Self } from '@angular/core';
import { NgControl, ControlValueAccessor, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-date',
  templateUrl: './registration-date.component.html',
  styleUrls: ['./registration-date.component.scss'],
})
export class RegistrationDateComponent implements ControlValueAccessor, OnInit {

  registrationDate: number;

  private _onChange: (value: any) => void;

  private _onTouch: () => void;

  private isDisabled: boolean;

  constructor( @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  ngOnInit() {
    const control = this.controlDir.control;
  }

  writeValue(obj: number): void {
    this.registrationDate = obj;
  }

  registerOnChange(fn: (value: any) => void): void {
    this._onChange = (val: any) => {
      fn(val); // will merge the value with the form control value
    };
  }

  registerOnTouched(fn: () => void): void {
    this._onTouch = () => {
      fn();
    };
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

}
