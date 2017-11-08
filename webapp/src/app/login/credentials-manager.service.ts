import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CredentialsManagerService {

  readonly p = 'qsecofr';

  constructor() { }

  get credentials(): Credentials {
    if (typeof (Storage) !== 'undefined' && localStorage.c) {

      const bytes  = CryptoJS.AES.decrypt(localStorage.c, this.p);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return new Credentials(decryptedData);
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
      localStorage.c = CryptoJS.AES.encrypt(JSON.stringify(credentials), this.p);
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
