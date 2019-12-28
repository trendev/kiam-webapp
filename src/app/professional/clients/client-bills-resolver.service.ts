import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ClientService } from '@app/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ClientBill } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class ClientBillsResolverService implements Resolve<ClientBill[]> {

  constructor(private clientService: ClientService,
    private router: Router,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ClientBill[] | Observable<ClientBill[]> | Promise<ClientBill[]> {
    const id = route.paramMap.get('id');
    return this.clientService.getClientBills(id).pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer les factures du client ${id}...`);
        this.router.navigate(['/professional/clients']);
        return of([]);
      })
    );
  }

}
