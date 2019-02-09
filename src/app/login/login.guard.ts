
import { of, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { DispatcherService } from '@app/login/dispatcher.service';



@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
    private dispatcher: DispatcherService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const loginRequired: boolean = next.queryParamMap.get('login-required') ? true : false;

    /**
     * controls the origin of the request : activates the login interface if it's a redirection
     * or if a login is required (navigation from a logout or from a register page for ex).
     */
    if (loginRequired || this.authenticationService.redirectUrl) {
      return of(true);
    } else {
      // controls if the user is already authenticated on the server
      return this.authenticationService.profile().pipe(
        map(
          u => this.dispatcher.redirect()),
        catchError(
          // if the user is not authenticated the login page is displayed
          e => of(true)
        )
      );
    }
  }
}
