import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CollectiveGroup } from '@app/entities';
import { Observable } from 'rxjs/Observable';
import { ProfessionalService } from './professional.service';

@Injectable()
export class CollectiveGroupsResolverService implements Resolve<CollectiveGroup[]> {
  constructor(private professionalService: ProfessionalService) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): CollectiveGroup[] | Observable<CollectiveGroup[]> | Promise<CollectiveGroup[]> {
    return this.professionalService.getCollectiveGroups();
  }

}
