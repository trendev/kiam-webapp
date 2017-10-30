import { Administrator, Individual, Professional, UserAccount } from '@app/entities';
import { environment } from '@env/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/throw'; // will handle TypeError: Observable_1.Observable.throw is not a function


@Injectable()
export class AuthenticationService {

  redirectUrl: string;
  private _isLoggedIn = false;
  user: UserAccount;

  readonly api = `${environment.api}/Authentication`;

  constructor(private http: HttpClient) { }

  reset() {
    this.user = undefined;
    this._isLoggedIn = false;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<UserAccount>(`${this.api}/login?username=${username}&password=${password}`,
      { withCredentials: true })
      .map(user => {
        this.user = user;
        this._isLoggedIn = true;
        return true;
      })
      .catch(e => {
        console.error('Caught an ERROR in AuthenticationService#login!!!');
        console.error(e);
        this.reset();
        return Observable.of(false);
      });
  }

  logout(): Observable<boolean> {
    this.reset();
    return this.http.post<any>(`${this.api}/logout`,
      null,
      { observe: 'response', withCredentials: true })
      .map(resp => {
        return true;
      })
      .catch(e => {
        console.error('Caught an ERROR in AuthenticationService#logout!!!');
        console.error(e);
        return Observable.of(false);
      });
  }

  profile(): Observable<UserAccount> {
    return this.http.get<UserAccount>(`${this.api}/profile`,
      { withCredentials: true })
      .map(user => {
        this.user = user;
        this._isLoggedIn = true;
        return user;
      })
      .catch(e => {
        this.reset();
        return Observable.of(null);
      });
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

}
