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
    return this.authenticationService.user && this.authenticationService.user.cltype === UserAccountType.PROFESSIONAL;
  }
}
