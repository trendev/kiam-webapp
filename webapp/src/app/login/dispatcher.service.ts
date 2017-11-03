import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { UserAccountType } from '@app/entities';

@Injectable()
export class DispatcherService {

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  redirect(): boolean {
    let redirect: string;
    if (this.authenticationService.user) {
      switch (this.authenticationService.user.cltype) {
        case UserAccountType.PROFESSIONAL:
          redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/professional';
          this.router.navigate([redirect]);
          return true;
        case UserAccountType.INDIVIDUAL:
          redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/individual';
          this.router.navigate([redirect]);
          return true;
        case UserAccountType.ADMINISTRATOR:
          redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/administrator';
          this.router.navigate([redirect]);
          return true;
        default:
          console.error(`You are not authenticated with a supported UserAccount: ${this.authenticationService.user.cltype}` +
            ` should be ${UserAccountType.PROFESSIONAL} or ${UserAccountType.INDIVIDUAL} or ${UserAccountType.ADMINISTRATOR}`);
          return false;
      }
    }
  }

}
