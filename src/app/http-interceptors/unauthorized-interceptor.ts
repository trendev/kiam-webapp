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
                if (err.status === 401 || err.status === 403) {
                    if (!req.url.endsWith('/api/Authentication/profile')) {
                        this.snackBar.openFromComponent(ErrorMessageComponent,
                            {
                                data: `Accès NON Autorisé : Identification incorrecte/bloquée ou Session expirée`,
                                duration: 3000
                            });
                    }
                    this.router.navigate(['/login'], this.authenticationService.loginRequired);
                }
                return throwError(err);
            })
        );
    }
}
