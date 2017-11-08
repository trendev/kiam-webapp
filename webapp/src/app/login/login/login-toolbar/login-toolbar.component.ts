import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-login-toolbar',
  templateUrl: './login-toolbar.component.html',
  styleUrls: ['./login-toolbar.component.scss']
})
export class LoginToolbarComponent {
  title = `${environment.title}`;

  constructor() { }
}
