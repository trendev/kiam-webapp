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
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
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

  @ViewChild('input') input: ElementRef;
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

      this.updateInput(value);

      this.value = value;
      this.stateChanges.next();

      if (Utils.isValidPhoneNumber(value)) {
        fn(Utils.shrinkPhoneNumber(value));
      } else {
        fn(value);
      }
    };
  }

  private updateInput(inputValue: string) {
    const start = this.input.nativeElement.selectionStart;
    const newValue = Utils.formatPhoneNumber(inputValue);
    this.input.nativeElement.value = newValue;

    // compute the length diff between the provided value and the formated one
    const diff = newValue.length - inputValue.length;

    // caret's offset (no move by default)
    let offset = start;

    switch (diff) {
      case -1: { // remove a character
        if (/\s/.test(`${inputValue.charAt(start - 1)}`)) { // if original char is a whitespace
          offset = start + diff; // slide to the left
        }
        break;
      }
      case 1: { // add a character
        if (/\s/.test(`${newValue.charAt(start - 1)}`)) { // if new char is a whitespace
          offset = start + diff; // slide to the right
        }
        break;
      }
      default: { // case for copy/paste
        offset = start + diff;
        break;
      }
    }
    this.input.nativeElement.setSelectionRange(offset, offset);
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

}
