import { CoreModule } from './core.module';

import { of, Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BusinessService } from './business.service';
import { Injectable } from '@angular/core';
import { Business } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable({
  providedIn: CoreModule
})
export class BusinessesResolverService implements Resolve<Business[]> {
  constructor(private businessService: BusinessService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Business[] | Observable<Business[]> | Promise<Business[]> {
    return this.businessService.businesses.pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la liste des activités...`);
        return of([]);
      }));
  }

}
