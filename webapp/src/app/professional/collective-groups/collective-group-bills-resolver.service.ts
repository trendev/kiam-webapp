import { Injectable } from '@angular/core';
import { CollectiveGroupService } from '@app/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ErrorHandlerService } from '@app/error-handler.service';
import { CollectiveGroupBill } from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CollectiveGroupBillsResolverService implements Resolve<CollectiveGroupBill[]> {

  constructor(private collectiveGroupService: CollectiveGroupService,
    private router: Router,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): CollectiveGroupBill[] | Observable<CollectiveGroupBill[]> | Promise<CollectiveGroupBill[]> {
    const id = +route.paramMap.get('id');
    return this.collectiveGroupService.getCollectiveGroupBills(id)
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les factures du groupe ${id}...`);
        this.router.navigate(['/professional/collective-groups']);
        return Observable.of([]);
      });
  }

}
