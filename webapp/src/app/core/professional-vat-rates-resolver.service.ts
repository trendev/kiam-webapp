import { ProfessionalService } from './professional.service';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from '@app/error-handler.service';
import { VatRates } from '@app/entities';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfessionalVatRatesResolverService implements Resolve<VatRates> {

  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): VatRates | Observable<VatRates> | Promise<VatRates> {
    return this.professionalService.profile()
      .map(pro => pro.vatRates) // vatRates should be defined if and only if pro.vatcode is defined
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les taux de TVA...`);
        return Observable.of(null);
      });
  }

}
