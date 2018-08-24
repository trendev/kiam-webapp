import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { stringify } from 'querystring';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  appName = environment.title;
  source: any;

  defaultAmount = 24;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Handles the new Stripe Soure creation
   * @param source A Stripe Source
   */
  handleNewSource(source) {
    console.log(source);
    this.source = source;
  }

}
