import { environment } from '@env/environment';
import { UserAccountType, UserAccount } from '@app/entities';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { DispatcherService } from '@app/login/dispatcher.service';
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

  user: UserAccount;

  readonly main_title = `${environment.title}`;
  readonly title = `Identification à ${this.main_title}`;
  readonly subtitle = `Une identification est requise pour pouvoir utiliser les services sécurisés de ${this.main_title}`;

  hide = true;

  constructor(private authenticationService: AuthenticationService,
    private dispatcher: DispatcherService,
    private router: Router) { }

  ngOnInit() {
  }

  get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }

  login() {
    this.authenticationService.login(this.username, this.password)
      .subscribe(
      r => this.dispatcher.redirect(),
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
