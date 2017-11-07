import { Injectable } from '@angular/core';

@Injectable()
export class CredentialsManagerService {

  constructor() { }

  get credentials(): Credentials {
    if (typeof (Storage) !== 'undefined' && localStorage.getItem('rememberMe')) {
      return new Credentials({
        username: localStorage.getItem('username'),
        password: localStorage.getItem('password'),
        rememberMe: true
      });
    } else {
      return new Credentials();
    }
  }

  clear() {
    if (typeof (Storage) !== 'undefined') {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
  }

  save(credentials: Credentials) {
    if (credentials.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('username', credentials.username);
      localStorage.setItem('password', credentials.password);
    }
  }

}

export class Credentials {

  username: string;
  password: string;
  rememberMe: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
