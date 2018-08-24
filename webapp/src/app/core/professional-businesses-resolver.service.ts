
import { of, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { ProfessionalService } from './professional.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Business } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class ProfessionalBusinessesResolverService implements Resolve<Business[]> {
  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Business[] | Observable<Business[]> | Promise<Business[]> {
    return this.professionalService.profile().pipe(
      map(pro => pro.businesses ? pro.businesses : []),
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la liste de tes activités...`);
        return of([]);
      })
    );
  }

}
