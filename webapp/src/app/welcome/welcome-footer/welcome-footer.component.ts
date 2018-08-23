import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-footer',
  templateUrl: './welcome-footer.component.html',
  styleUrls: ['./welcome-footer.component.scss']
})
export class WelcomeFooterComponent implements OnInit {
  twitterUrl = 'https://twitter.com/comptandye';
  facebookUrl = 'https://www.facebook.com/comptandye';
  constructor() { }

  ngOnInit() {
  }

}
