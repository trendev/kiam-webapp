import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ErrorHandlerService } from '@app/error-handler.service';
import { StripePaymentMethodService } from '@app/core';

@Injectable()
export class StripePaymentMethodResolver implements Resolve<any> {

  constructor(private stripePaymentMethodService: StripePaymentMethodService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {

    return this.stripePaymentMethodService.getPaymentMethods().pipe(
      tap(c => console.log(c)),
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer le détail de la souscription...`);
        return of(null);
      })
    );
  }
}
