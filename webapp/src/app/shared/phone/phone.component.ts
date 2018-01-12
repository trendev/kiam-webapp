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

  private _errorState = false;

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
  set value(val: string) {
    this._value = val;
    this.stateChanges.next();
    this.onChange(val);
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
    return !!this.ngControl.errors;
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

  writeValue(val: string): void {
    // this.input.nativeElement.value = Utils.formatPhoneNumber(val);
    this._value = val;
    this.stateChanges.next();
  }

  registerOnChange(fn: any): void {
    // this.onChange = (val: string) => {
    //   if (Utils.isValidPhoneNumber(val)) {
    //     this.input.nativeElement.value = Utils.formatPhoneNumber(val);
    //     fn(Utils.shrinkPhoneNumber(val));
    //   } else {
    //     fn(val);
    //   }
    // };
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

}
