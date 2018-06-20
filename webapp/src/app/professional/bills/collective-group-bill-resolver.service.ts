import { catchError } from 'rxjs/operators/catchError';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CollectiveGroupBill } from '@app/entities';
import { CollectiveGroupService } from '@app/core';
import { Observable, of } from 'rxjs';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class CollectiveGroupBillResolverService implements Resolve<CollectiveGroupBill> {

  constructor(private collectiveGroupService: CollectiveGroupService,
    private router: Router,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): CollectiveGroupBill | Observable<CollectiveGroupBill> | Promise<CollectiveGroupBill> {
    const id = +route.paramMap.get('id');
    const ref = route.paramMap.get('ref');
    return this.collectiveGroupService.getCollectiveGroupBill(id, ref).pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la facture ${ref} du groupe ${id}...`);
        this.router.navigate(['/professional/collective-groups']);
        return of(null);
      })
    );
  }

}
