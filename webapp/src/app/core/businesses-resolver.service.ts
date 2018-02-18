import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BusinessService } from './business.service';
import { Injectable } from '@angular/core';
import { Business } from '@app/entities';
import { Observable } from 'rxjs/Observable';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class BusinessesResolverService implements Resolve<Business[]> {
  constructor(private businessService: BusinessService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Business[] | Observable<Business[]> | Promise<Business[]> {
    return this.businessService.businesses
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la liste des activités...`);
        return Observable.of([]);
      });
  }

}
