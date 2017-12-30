import { ProfessionalService } from './professional.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfessionalBilllsRefDateResolverService implements Resolve<number> {

  constructor(private professionalService: ProfessionalService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): number | Observable<number> | Promise<number> {
    return this.professionalService.profile()
      .map(pro => pro.billsRefDate ? pro.billsRefDate : undefined);
  }


}
