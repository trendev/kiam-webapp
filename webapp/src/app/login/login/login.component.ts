import { environment } from '@env/environment';
import { UserAccountType, UserAccount } from '@app/entities';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  readonly main_title = `${environment.title}`;
  readonly title = `Identification à ${this.main_title}`;
  readonly subtitle = `Une identification est requise pour pouvoir utiliser les services sécurisés de ${this.main_title}`;

  username: string;
  password: string;
  message: string;

  user: UserAccount;

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.authenticationService.profile()
    .subscribe(
      u => this.redirect(),
      e => console.warn('Login required : no authenticated user yet')
    );
  }

  private redirect() {
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
        redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/administrator';
        this.router.navigate([redirect]);
        break;
      default:
        console.error(this.authenticationService.user.cltype + ' is not a supported type of UserAccount');
        break;
    }
  }

  login() {
    this.authenticationService.login(this.username, this.password)
      .subscribe(
      r => this.redirect(),
      e => this.message = 'Identification incorrecte : vérifier vos identifiants ou votre connexion au serveur'
      );
  }

  get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }
}
