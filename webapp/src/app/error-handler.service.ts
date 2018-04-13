import { AuthenticationService } from './core/authentication.service';
import { UnexpectedErrorComponent } from './shared/snack-messages/unexpected-error/unexpected-error.component';
import { ErrorMessageComponent } from './shared/snack-messages/error-message/error-message.component';
import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/observable/throw';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerService {

  errmsg: string;

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  /**
   * Updates errmsg, logs it on the console and returns an ErrorObservable with the message
   * @param err the error to handle
   */
  handle(err: HttpErrorResponse | Error, message?: string): ErrorObservable {
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

        if (err.status === 404 || err.status === 0 || err.status === 504) { // service is offline
          this.snackBar.openFromComponent(ErrorMessageComponent,
            {
              data: `Problèmes de connexion à Internet ou Application hors ligne pour le moment`,
              duration: 5000
            });
        } else {
          if (err.status === 401 || err.status === 403) { // UNAUTHORIZED USER
            this.snackBar.openFromComponent(ErrorMessageComponent,
              {
                data: `Accès NON Autorisé : Identification incorrecte/bloquée ou Session expirée`,
                duration: 3000
              });
            this.router.navigate(['/login'], this.authenticationService.loginRequired);
          } else {
            this.snackBar.openFromComponent(UnexpectedErrorComponent, {
              data: message || 'une erreur est survenue',
              duration: 5000
            });
          }
        }

      }
    }
    // return Observable.throw(this.errmsg);
    return Observable.throw(err);
  }

}
