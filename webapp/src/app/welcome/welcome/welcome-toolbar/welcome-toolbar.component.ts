import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-welcome-toolbar',
  templateUrl: './welcome-toolbar.component.html',
  styleUrls: ['./welcome-toolbar.component.scss']
})
export class WelcomeToolbarComponent {
  title = `${environment.title}`;

  constructor() { }

}
