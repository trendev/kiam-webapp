import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '@app/error-handler.service';
import { StripePlanService } from '@app/core';

@Injectable()
export class StripePlanResolver implements Resolve<any> {

  constructor(private stripePlanService: StripePlanService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {

    return this.stripePlanService.getPlans().pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les abonnements possibles...`);
        return of(null);
      })
    );
  }
}
