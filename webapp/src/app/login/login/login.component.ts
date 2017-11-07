import { environment } from '@env/environment';
import { UserAccountType, UserAccount } from '@app/entities';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { DispatcherService } from '@app/login/dispatcher.service';
import { CredentialsManagerService } from '@app/login/credentials-manager.service';
import { Router } from '@angular/router';
import { Credentials } from '@app/login/credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  credentials: Credentials;

  message: string;

  user: UserAccount;

  readonly main_title = `${environment.title}`;
  readonly title = `Identification à ${this.main_title}`;
  readonly subtitle = `Une identification est requise pour pouvoir utiliser les services sécurisés de ${this.main_title}`;

  hide = true;

  constructor(private authenticationService: AuthenticationService,
    private dispatcher: DispatcherService,
    private router: Router,
    private credentialsManagerService: CredentialsManagerService) {

    this.credentials = new Credentials();

    if (typeof (Storage) !== 'undefined' && localStorage.getItem('rememberMe')) {
      this.credentials = new Credentials({
        username: localStorage.getItem('username'),
        password: localStorage.getItem('password'),
        rememberMe: true
      });
    }
  }

  ngOnInit() {
  }

  get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }

  get rememberMe(): boolean {
    return this.credentials.rememberMe;
  }

  set rememberMe(value: boolean) {
    if (!value) {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
    this.credentials.rememberMe = value;
  }

  login() {
    this.authenticationService.login(this.credentials.username, this.credentials.password)
      .subscribe(
      r => {
        if (typeof (Storage) !== 'undefined') {
          if (this.credentials.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('username', this.credentials.username);
            localStorage.setItem('password', this.credentials.password);
          } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('username');
            localStorage.removeItem('password');
          }
        }
        this.dispatcher.redirect();
      },
      e => {
        if (e.match(/Blocked/)) {
          this.message = `Identification impossible : votre compte à été bloqué`;
        } else {
          this.message = `Identification incorrecte : vérifier vos identifiants ou votre connexion au serveur`;
          this.message += ` [${this.credentials.username}]/[${this.credentials.password}]`;
        }
      });
  }

  register() {
    this.router.navigate(['/register']);
  }
}
