import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  errmsg: string;
  logoutmsg: string;

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authenticationService.login(this.username, this.password)
      .subscribe(
      auth => {
        let redirect: string;
        switch (this.authenticationService.user.cltype) {
          case 'Professional':
            redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/professional';
            this.router.navigate([redirect]);
            break;
          case 'Individual':
            redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/individual';
            this.router.navigate([redirect]);
            break;
          case 'Administrator':
            this.errmsg =
              `Administrator ${this.authenticationService.user.email} is logged in`
              + ` but cannot access to Administration Console from this form: use the Backdoor instead !`;
            break;
          default:
            console.error(this.authenticationService.user.cltype + ' is not a supported type of UserAccount');
            break;
        }
      },
      e => this.errmsg = 'Authentification incorrecte : Vérifier vos paramètres d\'authentication ou la connexion au serveur'
      );
  }

  get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }
}
