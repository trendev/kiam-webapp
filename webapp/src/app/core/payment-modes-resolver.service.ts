import { PaymentModeService } from './payment-mode.service';
import { Injectable } from '@angular/core';
import { PaymentMode } from '@app/entities';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class PaymentModesResolverService implements Resolve<PaymentMode[]> {

  constructor(private paymentModeService: PaymentModeService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PaymentMode[] | Observable<PaymentMode[]> | Promise<PaymentMode[]> {
    return this.paymentModeService.paymentModes
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les moyens de paiement...`);
        return Observable.of([]);
      });
  }

}
