import { CoreModule } from './core.module';

import {of,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CollectiveGroup } from '@app/entities';
import { ProfessionalService } from './professional.service';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable({
  providedIn: CoreModule
})
export class CollectiveGroupsResolverService implements Resolve<CollectiveGroup[]> {
  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): CollectiveGroup[] | Observable<CollectiveGroup[]> | Promise<CollectiveGroup[]> {
    return this.professionalService.getCollectiveGroups().pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les groupes/collectivités...`);
        return of([]);
      }));
  }

}
