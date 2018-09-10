import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StripeSubscriptionService } from '@app/core';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class StripeCustomerResolverService implements Resolve<any> {

  constructor(private stripeSubscriptionService: StripeSubscriptionService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {

    return this.stripeSubscriptionService.details().pipe(
      tap(s => console.log(s)), // TODO : debug purposes
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer ton profil...`);
        return of(null);
      })
    );
  }
}
