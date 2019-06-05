import { CoreModule } from './core.module';

import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map, retry } from 'rxjs/operators';
import { UserAccount } from '@app/entities';
import { environment } from '@env/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavigationExtras } from '@angular/router';



@Injectable({
  providedIn: CoreModule
})
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
    return this.http.get<UserAccount>(`${this.api}/login`, {
      params: new HttpParams()
        .set('username', username)
        .set('password', password)
    }).pipe(
      map(user => {
        this.user = user;
        this._isLoggedIn = true;
        return true;
      }),
      catchError(e => {
        this.resetUserInformation();
        return observableThrowError(e);
      })
    );
  }

  logout(): Observable<boolean> {
    this.resetUserInformation();
    return this.http.post<any>(`${this.api}/logout`,
      null,
      { observe: 'response' }).pipe(
        map(() => true),
        catchError(e => observableThrowError(e))
      );
  }

  profile(): Observable<UserAccount> {
    return this.http.get<UserAccount>(`${this.api}/profile`).pipe(
      map(user => {
        this.user = user;
        this._isLoggedIn = true;
        return this.user;
      }),
      catchError(e => {
        this.resetUserInformation();
        return observableThrowError(e);
      })
    );
  }

  password(size: number = 10): Observable<string> {
    return this.http.get(`${this.api}/password`,
      {
        params: new HttpParams()
          .set('size', size + ''),
        responseType: 'text'
      }).pipe(
        retry(3),
        catchError(e => {
          this.resetUserInformation();
          return observableThrowError(e);
        })
      );
  }

  newPassword(password: string): Observable<string> {

    const payload = {
      newpassword: password
    };

    return this.http.put<PasswordResponse>(`${this.api}/new-password`,
      payload).pipe(
        map(resp => resp.password),
        catchError(e => observableThrowError(e))
      );
  }

}

interface PasswordResponse {
  password: string;
}

// export const loginRequired: NavigationExtras = {
//   queryParams: { 'login-required': true }
// };
