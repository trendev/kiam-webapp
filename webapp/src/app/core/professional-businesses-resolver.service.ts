import { ProfessionalService } from './professional.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Business } from '@app/entities';
import { Observable } from 'rxjs/Observable';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class ProfessionalBusinessesResolverService implements Resolve<Business[]> {
  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Business[] | Observable<Business[]> | Promise<Business[]> {
    return this.professionalService.profile()
      .map(pro => pro.businesses ? pro.businesses : [])
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la liste de vos activités...`);
        return Observable.of([]);
      });
  }

}
