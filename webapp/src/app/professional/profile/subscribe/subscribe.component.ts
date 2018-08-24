import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  appName = environment.title;

  defaultAmount = 24;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Handles the new Stripe Soure creation
   * @param source A Stripe Source
   */
  handleNewSource(source: any) {
    console.log(source);
  }

}
