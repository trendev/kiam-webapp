import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Bill } from '@app/entities';
import { ProfessionalService } from './professional.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfessionalBillsResolverService implements Resolve<Bill[]> {

  constructor(private professionalService: ProfessionalService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Bill[] | Observable<Bill[]> | Promise<Bill[]> {
    return this.professionalService.getBills();
  }

}
