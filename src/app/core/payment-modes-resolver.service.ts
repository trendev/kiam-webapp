import { CoreModule } from './core.module';

import { of, Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { PaymentModeService } from './payment-mode.service';
import { Injectable } from '@angular/core';
import { PaymentMode } from '@app/entities';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable({
  providedIn: CoreModule
})
export class PaymentModesResolverService implements Resolve<PaymentMode[]> {

  constructor(private paymentModeService: PaymentModeService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PaymentMode[] | Observable<PaymentMode[]> | Promise<PaymentMode[]> {
    return this.paymentModeService.paymentModes.pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les moyens de paiement...`);
        return of([]);
      }));
  }

}
