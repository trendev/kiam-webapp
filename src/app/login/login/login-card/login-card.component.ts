import { LoadingOverlayService } from '@app/loading-overlay.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { Component } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { DispatcherService } from '@app/login/dispatcher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss']
})
export class LoginCardComponent {

  errors: any = {};

  readonly main_title = `${environment.title}`;
  readonly title = `Identification à ${this.main_title}`;
  readonly subtitle = `Une identification est requise pour pouvoir utiliser les services sécurisés de ${this.main_title}`;

  // hide/show password
  hide = true;

  // remember me : flag used for long term connections
  rmbme = false;

  username: string;
  password: string;

  constructor(private authenticationService: AuthenticationService,
    private dispatcher: DispatcherService,
    private router: Router,
    private loadingOverlayService: LoadingOverlayService) {
  }

  get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }

  login() {
    this.loadingOverlayService.start();
    this.errors = {};
    this.authenticationService.login(this.username, this.password)
      .subscribe(
        r => this.dispatcher.redirect(),
        e => {
          this.loadingOverlayService.stop();
          if (e instanceof HttpErrorResponse
            && e.error.error
            && e.error.error.match(/Blocked/)) {
            this.errors.blocked = `User has been blocked`;
          } else {
            this.errors.unauthorized = `Unauthorized or Network issues or Server Down`;
          }
        });
  }

  register() {
    this.router.navigate(['/register']);
  }
}
