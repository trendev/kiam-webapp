import { LoadingOverlayService } from '@app/loading-overlay.service';
import { HttpErrorResponse } from '@angular/common/http';
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

  errors: any = {};

  readonly main_title = `${environment.title}`;
  readonly title = `Identification à ${this.main_title}`;
  readonly subtitle = `Une identification est requise pour pouvoir utiliser les services sécurisés de ${this.main_title}`;

  // hide/show password
  hide = true;

  constructor(private authenticationService: AuthenticationService,
    private dispatcher: DispatcherService,
    private router: Router,
    private credentialsManagerService: CredentialsManagerService,
    private loadingOverlayService: LoadingOverlayService) {

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
    this.loadingOverlayService.start();
    this.errors = {};
    this.authenticationService.login(this.credentials.username, this.credentials.password)
      .subscribe(
      r => {
        this.credentialsManagerService.save(this.credentials);
        this.dispatcher.redirect();
      },
      e => {
        this.loadingOverlayService.stop();
        if (e instanceof HttpErrorResponse
          && e.error.error
          && e.error.error.match(/Blocked/)) {
          this.errors.blocked = `User has been blocked`;
        } else {
          this.errors.unauthorized = `Unauthorized or network issues or server down`;
        }
      });
  }

  register() {
    this.router.navigate(['/register']);
  }
}
