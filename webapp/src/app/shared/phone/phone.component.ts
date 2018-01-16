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
  private _value: string;
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
  get value() {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this.stateChanges.next();
    this.onChange(value);
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
    return !this._value;
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
    this.input.nativeElement.value = Utils.formatPhoneNumber(value);
    this._value = value;
    this.stateChanges.next();
  }

  registerOnChange(fn: any): void {
    this.onChange = (value: string) => {
      const start = this.input.nativeElement.selectionStart;
      console.log(`[${value}] : ${start}`);
      this.input.nativeElement.value = Utils.formatPhoneNumber(value);
      const diff = this.input.nativeElement.value.length - value.length;
      this.input.nativeElement.setSelectionRange(start + diff, start + diff);

      if (Utils.isValidPhoneNumber(value)) {
        fn(Utils.shrinkPhoneNumber(value));
      } else {
        fn(value);
      }
    };
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

}
