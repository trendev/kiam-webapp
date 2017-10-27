import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthenticationService {

  isLoggedIn = false;
  redirectUrl: string;

  baseUrl = `${environment.api}/Authentication`;

  login(): Observable<boolean> {
    return null;
  }

  logout(): void {
    console.warn('you have called AuthenticationService#logout');
    console.warn(`baseUrl = ${this.baseUrl}`);
  }

  constructor(private http: HttpClient) { }

}
