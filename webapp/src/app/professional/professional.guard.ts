import { UserAccountType } from './../entities/user-account.model';
import { UserAccount } from '@app/entities';
import { AuthenticationService } from '@app/core';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfessionalGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): Observable<boolean> {
    // controls if the user is already authenticated on the webapp
    if (this.authenticationService.isLoggedIn
      && this.authenticationService.user
      && this.authenticationService.user.cltype === UserAccountType.PROFESSIONAL) {
      return Observable.of(true);
    } else {
      // controls if the user is already authenticate on the server
      return this.authenticationService.profile()
        .map(u => {
          if (u.cltype === UserAccountType.PROFESSIONAL) {
            return true; // the user is authenticated
          } else {
            // the user is authenticated but it's not a Professinal
            // will be automatically dispatched to the right interface (dashboard)
            console.warn(`You are not authenticated as a ${UserAccountType.PROFESSIONAL}`);
            this.router.navigate(['/login']);
            return false;
          }
        })
        // the user is not authenticated and must enter its credentials on the login page
        .catch(e => {
          this.authenticationService.redirectUrl = url;
          this.router.navigate(['/login']);
          return Observable.of(false);
        });
    }
  }
}
