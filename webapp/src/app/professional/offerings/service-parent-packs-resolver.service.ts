import { OfferingType, Pack } from '@app/entities';
import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ServiceService } from '@app/core';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class ServiceParentPacksResolverService implements Resolve<Pack[]> {
  constructor(private serviceService: ServiceService,
    private router: Router,
    private errorHandler: ErrorHandlerService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Pack[] | Observable<Pack[]> | Promise<Pack[]> {
      const id = +route.paramMap.get('id');
      return this.serviceService.getParentPacks(id)
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la liste des forfaits qui incluent le service ${id}...`);
        this.router.navigate(['/professional/offerings', { ot: OfferingType.SERVICE }]);
        return Observable.of([]);
      });
    }
}
