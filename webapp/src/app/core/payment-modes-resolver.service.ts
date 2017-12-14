import { PaymentModeService } from './payment-mode.service';
import { Injectable } from '@angular/core';
import { PaymentMode } from '@app/entities';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PaymentModesResolverService implements Resolve<PaymentMode[]> {

  constructor(private paymentModeService: PaymentModeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PaymentMode[] | Observable<PaymentMode[]> | Promise<PaymentMode[]> {
    return this.paymentModeService.paymentModes;
  }

}
