import { CoreModule } from './core.module';

import { of, Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Bill } from '@app/entities';
import { ProfessionalService } from './professional.service';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable({
  providedIn: CoreModule
})
export class ProfessionalBillsResolverService implements Resolve<Bill[]> {

  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Bill[] | Observable<Bill[]> | Promise<Bill[]> {
    return this.professionalService.getBills().pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les factures...`);
        return of([]);
      }));
  }

}
