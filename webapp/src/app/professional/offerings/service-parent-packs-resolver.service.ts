import { OfferingType, Pack } from '@app/entities';
import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ServiceService } from '@app/core';

@Injectable()
export class ServiceParentPacksResolverService implements Resolve<Pack[]> {
  constructor(private serviceService: ServiceService,
    private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Pack[] | Observable<Pack[]> | Promise<Pack[]> {
      const id = +route.paramMap.get('id');
      return this.serviceService.getParentPacks(id)
      .catch(e => {
        this.router.navigate(['/professional/offerings', { ot: OfferingType.SERVICE }]);
        return Observable.of([]);
      });
    }
}
