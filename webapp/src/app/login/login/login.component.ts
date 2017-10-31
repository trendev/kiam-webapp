import { UserAccountType } from './../../entities/user-account.model';
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
  message: string;

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
          case UserAccountType.PROFESSIONAL:
            redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/professional';
            this.router.navigate([redirect]);
            break;
          case UserAccountType.INDIVIDUAL:
            redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/individual';
            this.router.navigate([redirect]);
            break;
          case UserAccountType.ADMINISTRATOR:
            this.message =
              `Administrator ${this.authenticationService.user.email} is logged in`
              + ` but cannot access to Administration Console from this form: use the Backdoor instead !`;
            break;
          default:
            console.error(this.authenticationService.user.cltype + ' is not a supported type of UserAccount');
            break;
        }
      },
      e => this.message = 'Authentification incorrecte : vérifier vos paramètres d\'authentication ou la connexion au serveur'
      );
  }

  get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }
}
