import { Injectable } from '@angular/core';
import { ClientService } from '@app/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ClientBill, BillType } from '@app/entities';

@Injectable()
export class ClientBillsResolverService implements Resolve<ClientBill[]> {

  constructor(private clientService: ClientService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ClientBill[] | Observable<ClientBill[]> | Promise<ClientBill[]> {
    const id = +route.paramMap.get('id');
    return this.clientService.getClientBills(id)
      .catch(e => {
        this.router.navigate(['/professional/clients']);
        return Observable.of([]);
      });
  }

}
