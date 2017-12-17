import { Injectable } from '@angular/core';
import { ProfessionalService } from '@app/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Pack, OfferingType } from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PackDetailResolverService implements Resolve<Pack> {

  constructor(private professionalService: ProfessionalService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Pack | Observable<Pack> | Promise<Pack> {
    const id = +route.paramMap.get('id');
    return this.professionalService.getOfferings()
      .map(offerings => {
        const pack = offerings.filter(c => c.id === id).pop();
        if (pack) {
          return new Pack(pack);
        } else {
          console.warn(`Pack ${id} does not exist !`);
          this.router.navigate(['/professional/offerings', { ot: OfferingType.PACK }]);
          return null;
        }
      });
  }
}
