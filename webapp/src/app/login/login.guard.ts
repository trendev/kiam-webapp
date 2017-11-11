import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { DispatcherService } from '@app/login/dispatcher.service';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'; // will handle TypeError: Observable_1.Observable.throw is not a function

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
    private dispatcher: DispatcherService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const loginRequired: boolean = next.queryParamMap.get('login-required') ? true : false;
    console.error(`login-required=[${loginRequired}] & state.url=[${state.url}]`);

    /**
     * controls the origin of the request : activates the login interface if it's a redirection
     * or if a login is required (navigation from a logout or from a register page for ex).
     */
    if (loginRequired || this.authenticationService.redirectUrl) {
      return Observable.of(true);
    } else {
      // controls if the user is already authenticated on the server
      return this.authenticationService.profile()
        .map(
        u => this.dispatcher.redirect())
        .catch(
        // if the user is not authenticated the login page is displayed
        e => Observable.of(true)
        );
    }
  }
}
