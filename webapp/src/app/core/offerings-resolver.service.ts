
import { of, Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProfessionalService } from './professional.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Offering } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class OfferingsResolverService implements Resolve<Offering[]> {
  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Offering[] | Observable<Offering[]> | Promise<Offering[]> {
    return this.professionalService.getOfferings().pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les offres...`);
        return of([]);
      }));
  }
}
