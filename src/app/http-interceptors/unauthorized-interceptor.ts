import { AuthenticationService } from './../core/authentication.service';
import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorMessageComponent } from '@app/shared';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

    constructor(private snackBar: MatSnackBar,
        private authenticationService: AuthenticationService,
        private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError(err => {
                if (err.status === 401 || err.status === 403) { // UNAUTHORIZED ACCESS
                    // control if the route is the root or the login page
                    if (this.router.url !== '/' && this.router.url !== '/login') {
                        this.snackBar.openFromComponent(ErrorMessageComponent,
                            {
                                data: `Accès NON Autorisé : Identification incorrecte/bloquée ou Session expirée`,
                                duration: 5000
                            });
                        // auto-redirect to login page
                        // AND prevent testing if user is authenticated
                        this.router.navigate(['/login'], this.authenticationService.loginRequired);
                    }
                }
                // all errors are propagated and should be caught in error handler
                // even 401/403 HTTP errors which will be ignored in error handler
                return throwError(err);
            })
        );
    }
}
