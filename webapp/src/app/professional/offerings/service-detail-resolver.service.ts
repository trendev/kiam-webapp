import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Service, OfferingType } from '@app/entities';
import { ProfessionalService } from '@app/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ServiceDetailResolverService implements Resolve<Service> {

  constructor(private professionalService: ProfessionalService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Service | Observable<Service> | Promise<Service> {
    const id = +route.paramMap.get('id');
    return this.professionalService.getOfferings()
      .map(offerings => {
        const service = offerings.filter(c => c.id === id).pop();
        if (service) {
          return new Service(service);
        } else {
          console.warn(`Service ${id} does not exist !`);
          this.router.navigate(['/professional/offerings', { ot: OfferingType.SERVICE }]);
          return null;
        }
      });
  }

}
