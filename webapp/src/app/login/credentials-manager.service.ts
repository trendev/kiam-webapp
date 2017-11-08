import { Injectable } from '@angular/core';

@Injectable()
export class CredentialsManagerService {

  constructor() { }

  get credentials(): Credentials {
    if (typeof (Storage) !== 'undefined' && localStorage.credentials) {
      return new Credentials(JSON.parse(localStorage.credentials));
    } else {
      return new Credentials();
    }
  }

  clear() {
    if (typeof (Storage) !== 'undefined') {
      localStorage.clear();
      // localStorage.removeItem('credentials');
    }
  }

  save(credentials: Credentials) {
    if (credentials.rememberMe) {
      localStorage.credentials = JSON.stringify(credentials);
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
