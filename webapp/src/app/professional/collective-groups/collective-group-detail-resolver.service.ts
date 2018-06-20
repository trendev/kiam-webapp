import { catchError, map } from 'rxjs/operators';
import { CollectiveGroup } from '@app/entities';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProfessionalService } from '@app/core';
import { ErrorHandlerService } from '@app/error-handler.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class CollectiveGroupDetailResolverService implements Resolve<CollectiveGroup> {

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): CollectiveGroup | Observable<CollectiveGroup> | Promise<CollectiveGroup> {
    const id = +route.paramMap.get('id');
    return this.professionalService.getCollectiveGroups().pipe(
      map(collectiveGroups => {
        const cg = collectiveGroups.filter(c => c.id === id).pop();
        if (cg) {
          return cg;
        } else {
          console.warn(`CollectiveGroup ${id} does not exist !`);
          this.router.navigate(['/professional/collective-groups']);
          return null;
        }
      }),
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la fiche du groupe ${id}...`);
        this.router.navigate(['/professional/collective-groups']);
        return of(null);
      })
    );
  }

}
