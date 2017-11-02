import { ErrorHandlerService } from './error-handler.service';
import { Administrator, Individual, Professional, UserAccount } from '@app/entities';
import { environment } from '@env/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/throw'; // will handle TypeError: Observable_1.Observable.throw is not a function
import 'rxjs/add/operator/retry';


@Injectable()
export class AuthenticationService {

  redirectUrl: string;
  private _isLoggedIn = false;
  user: UserAccount;

  readonly api = `${environment.api}/Authentication`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  reset() {
    this.user = undefined;
    this._isLoggedIn = false;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<UserAccount>(`${this.api}/login`,
      {
        params: new HttpParams()
          .set('username', username)
          .set('password', password),
        withCredentials: true
      })
      .map(user => {
        this.user = user;
        this._isLoggedIn = true;
        return true;
      })
      .catch(e => {
        this.reset();
        return this.errorHandler.handle(e);
      });
  }

  logout(): Observable<string> {
    const username = this.user ? this.user.email : '';
    this.reset();
    return this.http.post<any>(`${this.api}/logout`,
      null,
      { observe: 'response', withCredentials: true })
      .map(resp => {
        return username;
      })
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

  profile(): Observable<UserAccount> {
    return this.http.get<UserAccount>(`${this.api}/profile`,
      { withCredentials: true })
      .map(user => {
        this.user = user;
        this._isLoggedIn = true;
        return this.user;
      })
      .catch(e => {
        this.reset();
        return this.errorHandler.handle(e);
      });
  }

  password(size?: number): Observable<string> {
    const s = size || 10;
    return this.http.get(`${this.api}/password`,
      {
        params: new HttpParams()
          .set('size', s + ''),
        withCredentials: true,
        responseType: 'text'
      })
      .retry(3)
      .catch(e => {
        this.reset();
        return this.errorHandler.handle(e);
      });
  }

}
