import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { UserAccountType } from '@app/entities';

@Injectable()
export class DispatcherService {

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  // controls and dispatches the user using its profile
  redirect(): boolean {
    let redirect: string;

    if (this.authenticationService.user) {
      switch (this.authenticationService.user.cltype) {
        case UserAccountType.PROFESSIONAL:
          redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/professional';
          break;
        case UserAccountType.INDIVIDUAL:
          redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/individual';
          break;
        case UserAccountType.ADMINISTRATOR:
          redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/administrator';
          break;
        default:
          // should not occur
          redirect = '/unsupported-user-type';
          break;
      }
      // reset the redirectUrl
      this.authenticationService.redirectUrl = undefined;
      this.router.navigate([redirect]);
    }
    return false;
  }
}
