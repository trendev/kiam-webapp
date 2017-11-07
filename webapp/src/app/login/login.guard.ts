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

    // controls is the user is already authenticated on the webapp
    if (this.authenticationService.user) {
      return Observable.of(this.dispatcher.redirect());
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
