import { Injectable } from '@angular/core';
import { ProfessionalService } from './professional.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Offering } from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OfferingsResolverService implements Resolve<Offering[]> {
  constructor(private professionalService: ProfessionalService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Offering[] | Observable<Offering[]> | Promise<Offering[]> {
    return this.professionalService.getOfferings();
  }
}
