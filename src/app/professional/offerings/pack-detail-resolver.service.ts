import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProfessionalService } from '@app/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Pack, OfferingType } from '@app/entities';
import { Observable, of } from 'rxjs';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class PackDetailResolverService implements Resolve<Pack> {

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Pack | Observable<Pack> | Promise<Pack> {
    const id = route.paramMap.get('id');
    return this.professionalService.getOfferings().pipe(
      map(offerings => {
        const pack = offerings.filter(c => c.id === id).pop();
        if (pack) {
          return new Pack(pack);
        } else {
          console.warn(`Pack ${id} does not exist !`);
          this.router.navigate(['/professional/offerings', { ot: OfferingType.PACK }]);
          return null;
        }
      }),
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer le détail du forfait ${id}...`);
        this.router.navigate(['/professional/offerings', { ot: OfferingType.PACK }]);
        return of(null);
      })
    );
  }
}
