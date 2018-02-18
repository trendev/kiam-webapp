import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Bill } from '@app/entities';
import { ProfessionalService } from './professional.service';
import { Observable } from 'rxjs/Observable';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class ProfessionalBillsResolverService implements Resolve<Bill[]> {

  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Bill[] | Observable<Bill[]> | Promise<Bill[]> {
    return this.professionalService.getBills()
    .catch(e => {
      this.errorHandler.handle(e, `Impossible de récupérer les factures...`);
      return Observable.of([]);
    });
  }

}
