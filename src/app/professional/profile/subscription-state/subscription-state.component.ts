import { Component, OnInit, Input } from '@angular/core';
import { Professional } from '@app/entities';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

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
    return diff > 30;
  }

  get remains(): number {
    moment.locale('fr');
    const delta = Math.abs(30 - moment().diff(moment(this.pro.registrationDate), 'days'));
    return moment.duration(delta, 'days').asDays();
  }

  companyIdIsDefined() {
    return !!this.pro.companyID;
  }

}
