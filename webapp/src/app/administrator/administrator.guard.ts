import { UserAccountType } from './../entities/user-account.model';
import { AuthenticationService } from '@app/core';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AdministratorGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): Observable<boolean> {
    if (this.authenticationService.isLoggedIn
      && this.authenticationService.user
      && this.authenticationService.user.cltype === UserAccountType.ADMINISTRATOR) {
      return of(true);
    } else {
      return this.authenticationService.profile().pipe(
        map(u => {
          if (u.cltype === UserAccountType.ADMINISTRATOR) {
            return true;
          } else {
            console.warn(`You are not authenticated as a ${UserAccountType.ADMINISTRATOR}`);
            this.router.navigate(['/login']);
            return false;
          }
        }),
        catchError(e => {
          this.authenticationService.redirectUrl = url;
          this.router.navigate(['/login']);
          return of(false);
        }));
    }
  }
}
