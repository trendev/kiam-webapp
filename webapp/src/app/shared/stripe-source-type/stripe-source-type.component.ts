import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stripe-source-type',
  templateUrl: './stripe-source-type.component.html',
  styleUrls: ['./stripe-source-type.component.scss']
})
export class StripeSourceTypeComponent implements OnInit {

  @Input() stype: string;

  constructor() { }

  ngOnInit() {
  }

}
