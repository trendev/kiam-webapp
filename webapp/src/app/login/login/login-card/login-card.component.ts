import { environment } from '@env/environment';
import { Component } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { DispatcherService } from '@app/login/dispatcher.service';
import { CredentialsManagerService, Credentials } from '@app/login/credentials-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss']
})
export class LoginCardComponent {
  credentials: Credentials;

  message: string;

  readonly main_title = `${environment.title}`;
  readonly title = `Identification à ${this.main_title}`;
  readonly subtitle = `Une identification est requise pour pouvoir utiliser les services sécurisés de ${this.main_title}`;

  // hide/show password
  hide = true;

  constructor(private authenticationService: AuthenticationService,
    private dispatcher: DispatcherService,
    private router: Router,
    private credentialsManagerService: CredentialsManagerService) {

    this.credentials = this.credentialsManagerService.credentials;
  }

  get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }

  get rememberMe(): boolean {
    return this.credentials.rememberMe;
  }

  set rememberMe(value: boolean) {
    if (!value) {
      this.credentialsManagerService.clear();
    }
    this.credentials.rememberMe = value;
  }

  login() {
    this.authenticationService.login(this.credentials.username, this.credentials.password)
      .subscribe(
      r => {
        this.credentialsManagerService.save(this.credentials);
        this.dispatcher.redirect();
      },
      e => {
        if (e.match(/Blocked/)) {
          this.message = `Identification impossible : votre compte à été bloqué`;
        } else {
          this.message = `Identification incorrecte : vérifier vos identifiants ou votre connexion au serveur`;
        }
      });
  }

  register() {
    this.router.navigate(['/register']);
  }
}
