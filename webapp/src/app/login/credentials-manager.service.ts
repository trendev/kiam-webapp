import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CredentialsManagerService {

  readonly p = 'Acta exteriora indicant interiora secreta.';

  constructor() { }

  get credentials(): Credentials {
    if (typeof (Storage) !== 'undefined' && localStorage.c && localStorage.d) {
      try {

        let bytes = CryptoJS.AES.decrypt(localStorage.d, this.p);
        const d = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        bytes = CryptoJS.AES.decrypt(localStorage.c, this.p + d);
        const c = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return new Credentials(c);

      } catch (Error) {
        console.error('Nulla certior custodia innocentia.');
        localStorage.removeItem('c');
        localStorage.removeItem('d');
        return new Credentials();
      }
    } else {
      return new Credentials();
    }
  }

  clear() {
    if (typeof (Storage) !== 'undefined') {
      localStorage.clear();
    }
  }

  save(credentials: Credentials) {
    if (credentials.rememberMe) {
      const d = new Date().getTime();
      localStorage.d = CryptoJS.AES.encrypt(d + '', this.p);
      localStorage.c = CryptoJS.AES.encrypt(JSON.stringify(credentials), this.p + d);
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
