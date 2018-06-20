
import { of, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { ProfessionalService } from './professional.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class ProfessionalBillsRefDateResolverService implements Resolve<number> {

  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): number | Observable<number> | Promise<number> {
    return this.professionalService.profile().pipe(
      map(pro => pro.billsRefDate ? pro.billsRefDate : undefined),
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la date de référence à partir du profil...`);
        return of(null);
      })
    );
  }


}
