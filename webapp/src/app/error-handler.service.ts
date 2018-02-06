import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/observable/throw';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorHandlerService {

  errmsg: string;

  constructor(public snackBar: MatSnackBar) { }

  /**
   * Updates errmsg, logs it on the console and returns an ErrorObservable with the message
   * @param err the error to handle
   */
  handle(err: HttpErrorResponse | Error): ErrorObservable {
    if (err instanceof Error) {
      this.errmsg = err.message;
      console.error('ErrorHandlerService#handle => ' + this.errmsg);
    } else { // HttpErrorResponse
      if (err.error instanceof Error) {
        this.errmsg =
          `A client-side or network error occurred: ${err.error.message}`;
        console.error('ErrorHandlerService#handle => ' + this.errmsg);
      } else {
        this.errmsg =
          `The backend returned an unsuccessful response code: ${err.status} - ${err.statusText || ''} ${err.message} `;
        this.errmsg += JSON.stringify(err.error) || '';
        console.warn('ErrorHandlerService#handle => ' + this.errmsg);

        if (err.status === 404 || err.status === 0) {
          this.snackBar.open(`Problèmes de connexion à internet ` +
            `ou Application hors ligne pour le moment (ex: maintenance en cours...)`,
            `ERREUR`,
            { duration: 5000 });
        }

        if (err.status === 401 || err.status === 403) {
          this.snackBar.open(`Accès non autorisé: identification incorrecte/bloquée ou session expirée...`,
            `ERREUR`,
            { duration: 3000 });
        }
      }
    }
    // return Observable.throw(this.errmsg);
    return Observable.throw(err);
  }

}
