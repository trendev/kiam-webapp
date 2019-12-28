import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PackService } from '@app/core';
import { Pack, OfferingType } from '@app/entities';
import { Observable, of } from 'rxjs';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class PackParentPacksResolverService implements Resolve<Pack[]> {
  constructor(private packService: PackService,
    private router: Router,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Pack[] | Observable<Pack[]> | Promise<Pack[]> {
    const id = route.paramMap.get('id');
    return this.packService.getParentPacks(id).pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la liste des forfaits qui incluent le forfait ${id}...`);
        this.router.navigate(['/professional/offerings', { ot: OfferingType.PACK }]);
        return of([]);
      })
    );
  }
}
