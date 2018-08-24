import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  @Output() newSource = new EventEmitter<any>();

  displayCardInfo = false;

  constructor() { }

  ngOnInit() {
  }

  handleNewSource(source: any) {
    this.displayCardInfo = false;
    this.newSource.emit(source);
  }

}
