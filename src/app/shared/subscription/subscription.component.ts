import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  @Input() amount: number;
  @Output() newToken = new EventEmitter<any>();

  displayCardInfo = false;

  constructor() { }

  ngOnInit() {
  }

  handleNewToken(source: any) {
    this.displayCardInfo = false;
    this.newToken.emit(source);
  }

}
