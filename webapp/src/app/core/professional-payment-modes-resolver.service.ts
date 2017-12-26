import { ProfessionalService } from './professional.service';
import { Injectable } from '@angular/core';
import { PaymentMode } from '@app/entities';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfessionalPaymentModesResolverService implements Resolve<PaymentMode[]> {
  constructor(private professionalService: ProfessionalService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PaymentMode[] | Observable<PaymentMode[]> | Promise<PaymentMode[]> {
    return this.professionalService.profile()
      .map(pro => pro.paymentModes ? pro.paymentModes : []);
  }
}
