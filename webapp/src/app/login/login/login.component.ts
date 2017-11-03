import { environment } from '@env/environment';
import { UserAccountType, UserAccount } from '@app/entities';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { DispatcherService } from '@app/login/dispatcher.service';

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
    private dispatcher: DispatcherService) { }

  ngOnInit() {
  }

  login() {
    this.authenticationService.login(this.username, this.password)
      .subscribe(
      r => this.dispatcher.redirect(),
      e => this.message = 'Identification incorrecte : vérifier vos identifiants ou votre connexion au serveur'
      );
  }

  get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }
}
