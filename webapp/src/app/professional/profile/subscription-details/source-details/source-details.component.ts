import { StripeSource } from './../stripe-source.model';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-source-details',
  templateUrl: './source-details.component.html',
  styleUrls: ['./source-details.component.scss']
})
export class SourceDetailsComponent {

  @Input() source: StripeSource;

  constructor() { }

}
