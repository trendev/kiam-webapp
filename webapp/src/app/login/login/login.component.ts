import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.login('comptandye@gmail.com', 'MeyQzGwl4O').subscribe();
  }

  logout() {
    console.warn('LoginComponent#logout()');
    this.authenticationService.logout().subscribe();
  }

}
