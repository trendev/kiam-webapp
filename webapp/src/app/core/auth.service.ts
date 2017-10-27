import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

  isLoggedIn = false;
  redirectUrl: string;

  login(): Observable<boolean> {
    return null;
  }

  logout(): void {

  }

  constructor(private http: HttpClient) { }

}
