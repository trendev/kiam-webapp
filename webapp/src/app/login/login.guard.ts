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

    if (this.authenticationService.user) {
      return Observable.of(this.dispatcher.redirect());
    } else {
      return this.authenticationService.profile()
        .map(
        u => this.dispatcher.redirect())
        .catch(
        e => Observable.of(true)
        );
    }
  }
}
