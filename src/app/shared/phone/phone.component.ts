import { Utils } from '../utils';
import { CustomValidators } from '../custom-validators';
import {
  Component,
  OnInit,
  forwardRef,
  Self,
  ViewChild,
  ElementRef,
  OnDestroy,
  Input,
  HostBinding,
  Optional
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  AbstractControl,
  NgControl,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Observable ,  Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
  providers: [
    // { provide: NG_VALUE_ACCESSOR, useExisting: PhoneComponent, multi: true },
    { provide: MatFormFieldControl, useExisting: PhoneComponent }
  ]
})
export class PhoneComponent implements ControlValueAccessor, MatFormFieldControl<string>, OnDestroy {

  static nextId = 0;
  value: string;
  stateChanges = new Subject<void>();
  focused = false;
  controlType = 'app-phone';
  private _disabled = false;
  private _required = false;
  private _placeholder: string;

  @ViewChild('input', { static: true }) input: ElementRef;
  @HostBinding() id = `${this.controlType}-${PhoneComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';

  onChange: any = () => { };
  private _onTouched: any = () => { };

  constructor(private fm: FocusMonitor, private elRef: ElementRef, @Optional() @Self() public ngControl: NgControl) {
    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    ngControl.valueAccessor = this;
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  @Input()
  get errorState() {
    return !!this.ngControl.errors && (this.ngControl.dirty || this.ngControl.touched);
  }

  get empty() {
    return !this.value;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  writeValue(value: string): void {
    const newValue = Utils.formatPhoneNumber(value);
    this.input.nativeElement.value = newValue;
    this.value = newValue;
    this.stateChanges.next();
  }

  registerOnChange(fn: any): void {
    this.onChange = (value: string) => {

      const newValue = this.updateInput(value);
      this.value = newValue;
      this.stateChanges.next();

      if (Utils.isValidPhoneNumber(newValue)) {
        fn(Utils.shrinkPhoneNumber(newValue));
      } else {
        fn(newValue);
      }
    };
  }

  private updateInput(inputValue: string): string {

    const value = this.controlWhitespace(inputValue);

    const newValue = Utils.formatPhoneNumber(value);
    const caretStart = this.input.nativeElement.selectionStart;
    this.input.nativeElement.value = newValue;

    // compute the length diff between the provided value and the formated one
    const diff = newValue.length - value.length;

    // caret's offset (no move by default)
    let offset = caretStart;

    switch (diff) {
      case -1: { // remove a character
        if (/\s/.test(`${value.charAt(caretStart - 1)}`)) { // if original char is a whitespace
          offset = caretStart + diff; // slide to the left
        }
        break;
      }
      case 1: { // add a character
        if (/\s/.test(`${newValue.charAt(caretStart - 1)}`)) { // if new char is a whitespace
          offset = caretStart + diff; // slide to the right
        }
        break;
      }
      default: { // case for copy/paste
        offset = caretStart + diff;
        break;
      }
    }
    this.input.nativeElement.setSelectionRange(offset, offset);

    return newValue;
  }

  /**
   * Control whitespace removal
   * @param inputValue the value of the input field
   */
  controlWhitespace(inputValue: string): string {
    const caretStart = this.input.nativeElement.selectionStart;

    if (inputValue.length - this.value.length === -1
      && /\s/.test(`${this.value.charAt(caretStart)}`)) {

      // set the new offset
      const offset = caretStart - 1;
      this.input.nativeElement.setSelectionRange(offset, offset);
      // remove the next character
      return inputValue.slice(0, offset) + inputValue.slice(offset + 1);

    } else {
      return inputValue;
    }
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

}
