import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { UserAccountType } from '@app/entities';

@Injectable()
export class DispatcherService {

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  redirect() {
    let redirect: string;
    if (this.authenticationService.user) {
      switch (this.authenticationService.user.cltype) {
        case UserAccountType.PROFESSIONAL:
          redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/professional';
          this.router.navigate([redirect]);
          break;
        case UserAccountType.INDIVIDUAL:
          redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/individual';
          this.router.navigate([redirect]);
          break;
        case UserAccountType.ADMINISTRATOR:
          redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/administrator';
          this.router.navigate([redirect]);
          break;
        default:
          console.error(this.authenticationService.user.cltype + ' is not a supported type of UserAccount');
          break;
      }
    }
  }

}
