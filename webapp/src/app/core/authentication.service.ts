import { Administrator, Individual, Professional, UserAccount } from '@app/entities';
import { environment } from '@env/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavigationExtras } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';


@Injectable()
export class AuthenticationService {

  redirectUrl: string;
  private _isLoggedIn = false;
  user: UserAccount;

  readonly loginRequired: NavigationExtras = {
    queryParams: { 'login-required': true }
  };

  readonly api = `${environment.api}/Authentication`;

  constructor(private http: HttpClient) { }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  resetUserInformation() {
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
        this.resetUserInformation();
        return Observable.throw(e);
      });
  }

  logout(): Observable<boolean> {
    this.resetUserInformation();
    return this.http.post<any>(`${this.api}/logout`,
      null,
      { observe: 'response', withCredentials: true })
      .map(resp => true)
      .catch(e => Observable.throw(e));
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
        this.resetUserInformation();
        return Observable.throw(e);
      });
  }

  password(size: number = 10): Observable<string> {
    return this.http.get(`${this.api}/password`,
      {
        params: new HttpParams()
          .set('size', size + ''),
        withCredentials: true,
        responseType: 'text'
      })
      .retry(3)
      .catch(e => {
        this.resetUserInformation();
        return Observable.throw(e);
      });
  }

  newPassword(password: string): Observable<string> {

    const payload = {
      newpassword: password
    };

    return this.http.put<PasswordResponse>(`${this.api}/new-password`,
      payload,
      { withCredentials: true })
      .map(resp => resp.password)
      .catch(e => Observable.throw(e));
  }

}

interface PasswordResponse {
  password: string;
}

// export const loginRequired: NavigationExtras = {
//   queryParams: { 'login-required': true }
// };
