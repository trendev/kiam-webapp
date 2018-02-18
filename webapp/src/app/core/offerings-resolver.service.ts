import { Injectable } from '@angular/core';
import { ProfessionalService } from './professional.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Offering } from '@app/entities';
import { Observable } from 'rxjs/Observable';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class OfferingsResolverService implements Resolve<Offering[]> {
  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Offering[] | Observable<Offering[]> | Promise<Offering[]> {
    return this.professionalService.getOfferings()
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les offres...`);
        return Observable.of([]);
      });
  }
}
