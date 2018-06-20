
import { of, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { ProfessionalService } from './professional.service';
import { Injectable } from '@angular/core';
import { PaymentMode } from '@app/entities';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class ProfessionalPaymentModesResolverService implements Resolve<PaymentMode[]> {
  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PaymentMode[] | Observable<PaymentMode[]> | Promise<PaymentMode[]> {
    return this.professionalService.profile().pipe(
      map(pro => pro.paymentModes ? pro.paymentModes : []),
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la liste de vos moyens de paiment...`);
        return of([]);
      })
    );
  }
}
