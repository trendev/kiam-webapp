import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CollectiveGroup } from '@app/entities';
import { Observable } from 'rxjs/Observable';
import { ProfessionalService } from './professional.service';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class CollectiveGroupsResolverService implements Resolve<CollectiveGroup[]> {
  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): CollectiveGroup[] | Observable<CollectiveGroup[]> | Promise<CollectiveGroup[]> {
    return this.professionalService.getCollectiveGroups()
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les groupes/collectivités...`);
        return Observable.of([]);
      });
  }

}
