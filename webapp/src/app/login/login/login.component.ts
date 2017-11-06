import { FormGroup, FormBuilder } from '@angular/forms';
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

  private username: string;
  private password: string;
  message: string;

  user: UserAccount;

  loginForm: FormGroup;

  readonly main_title = `${environment.title}`;
  readonly title = `Identification à ${this.main_title}`;
  readonly subtitle = `Une identification est requise pour pouvoir utiliser les services sécurisés de ${this.main_title}`;

  hide = true;
  private _rememberMe = true;

  constructor(private authenticationService: AuthenticationService,
    private dispatcher: DispatcherService,
    private router: Router,
    private fb: FormBuilder) {

    if (typeof (Storage) !== 'undefined') {
      this.username = localStorage.getItem('username');
      this.password = localStorage.getItem('password');
    }

    this.createForm();
  }

  ngOnInit() {
    this.loginForm.valueChanges.forEach(v => console.log(v));
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: this.username || '',
      password: this.password || ''
    });
  }

  get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }

  get rememberMe(): boolean {
    return this._rememberMe;
  }

  set rememberMe(value: boolean) {
    if (!value) {
      this.loginForm.reset({
        username: '',
        password: ''
      });
    }
    this._rememberMe = value;
  }

  login() {
    this.username = this.loginForm.get('username').value;
    this.password = this.loginForm.get('password').value;

    this.authenticationService.login(this.username, this.password)
      .subscribe(
      r => {
        if (typeof (Storage) !== 'undefined' && this._rememberMe) {
          localStorage.setItem('username', this.username);
          localStorage.setItem('password', this.password);
        }
        this.dispatcher.redirect();
      },
      e => {
        if (e.match(/Blocked/)) {
          this.message = `Identification impossible : votre compte à été bloqué`;
        } else {
          this.message = `Identification incorrecte : vérifier vos identifiants ou votre connexion au serveur`;
          this.message += ` [${this.username}]/[${this.password}]`;
        }
      });
  }

  register() {
    this.router.navigate(['/register']);
  }
}
