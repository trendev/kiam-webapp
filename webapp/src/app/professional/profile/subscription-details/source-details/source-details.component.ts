import { StripeSource } from './../stripe-source.model';
import { Component, OnChanges, Input, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-source-details',
  templateUrl: './source-details.component.html',
  styleUrls: ['./source-details.component.scss']
})
export class SourceDetailsComponent implements OnInit {

  @Input() source: StripeSource;
  @Output() default = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    // this.source.is_default = false;
  }

  defaultAction() {
    this.default.emit(this.source.id);
  }

  removeAction() {
    this.remove.emit(this.source.id);
  }

}
