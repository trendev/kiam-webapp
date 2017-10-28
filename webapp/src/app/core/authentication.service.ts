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

  isLoggedIn = false;
  redirectUrl: string;

  api = `${environment.api}/Authentication`;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any>(`${environment.api}/Authentication/login?username=${username}&password=${password}`,
      { observe: 'response', withCredentials: true })
      .map(resp => {
        console.log(resp);
        console.warn('now we will get the profile');
        return resp;
      })
      .switchMap(r => this.http.get<any>(`${environment.api}/Authentication/profile`,
        { observe: 'response', withCredentials: true })
        .map(resp2 => true)
        .catch(e => {
          console.warn('we have an error in the GET!!!');
          console.error(e);
          return Observable.of(false);
        })
      )
      .catch(e => {
        console.warn('we have an error in the POST!!!');
        console.error(e);
        return Observable.of(false);
      });
  }

  logout(): void {
  }

}
/**
 const api = environment.api;

    this.http.get<any>(api + '/api/Professional', { observe: 'response', withCredentials: true })
      .map(resp => console.log(resp))
      .catch(e => {
        console.error(e);
        return Observable.of([]);
      })
      .subscribe();

    // tslint:disable-next-line:max-line-length
    this.http.put<any>(api + '/api/Professional/vanessa.gay@gmail.com/insertToUserGroup/Individual',
    null,
    { observe: 'response', withCredentials: true })
      .map(resp => console.log(resp))
      .catch(e => {
        console.error(e);
        return Observable.of([]);
      })
      .subscribe();
 */
