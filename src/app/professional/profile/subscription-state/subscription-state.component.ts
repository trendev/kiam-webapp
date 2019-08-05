import { Component, OnInit, Input } from '@angular/core';
import { Professional } from '@app/entities';
import * as moment from 'moment';

@Component({
  selector: 'app-subscription-state',
  templateUrl: './subscription-state.component.html',
  styleUrls: ['./subscription-state.component.scss']
})
export class SubscriptionStateComponent implements OnInit {

  @Input() pro: Professional;
  message: string;

  constructor() { }

  ngOnInit() {
  }

  get isOverdue(): boolean {
    const diff = moment().diff(moment(this.pro.registrationDate), 'days');
    return diff >= 30;
  }

  remains(): string {
    moment.locale('fr');
    const delta = Math.abs(30 - moment().diff(moment(this.pro.registrationDate), 'days'));
    return moment.duration(delta, 'day').humanize(false);
  }

}
