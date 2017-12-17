import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PackService } from '@app/core';
import { Offering, OfferingType } from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PackParentPacksResolverService implements Resolve<Offering[]> {
  constructor(private packService: PackService,
    private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Offering[] | Observable<Offering[]> | Promise<Offering[]> {
      const id = +route.paramMap.get('id');
      return this.packService.getParentPacks(id)
      .catch(e => {
        this.router.navigate(['/professional/offerings', { ot: OfferingType.PACK }]);
        return Observable.of([]);
      });
    }
}
