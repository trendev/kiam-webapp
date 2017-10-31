import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/observable/throw';

@Injectable()
export class ErrorHandlerService {

  errmsg: string;

  constructor() { }

  /**
   * Updates errmsg, logs it on the console and returns an ErrorObservable with the message
   * @param err the error to handle
   */
  handle(err: HttpErrorResponse | Error): ErrorObservable {
    if (err instanceof Error) {
      this.errmsg = err.message;
    } else { // HttpErrorResponse
      if (err.error instanceof Error) {
        this.errmsg =
          `Une erreur est survenue sur votre navigateur ou sur le réseau: ${err.error.message}`;
      } else {
        this.errmsg =
          `Une erreur de traitement est survenue sur le serveur: ${err.status} - ${err.statusText || ''} ${err.message} `;
        this.errmsg += JSON.stringify(err.error) || '';
      }
    }

    console.error('ErrorHandlerService#handle => ' + this.errmsg);
    return Observable.throw(this.errmsg);
  }

}
