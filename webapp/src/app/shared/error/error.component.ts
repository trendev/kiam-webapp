import { AbstractControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  @Input() control: AbstractControl;
  @Input() error: string;

  constructor() {
  }

  ngOnInit() {
    if (!this.control) { throw new Error('ErrorComponent : control propery must be specified !'); }
    if (!this.error) { throw new Error('ErrorComponent : error propery must be specified !'); }
  }

  get show() {
    return this.control.hasError(this.error) && (this.control.dirty || this.control.touched);
  }
}
