import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ClientBill } from '@app/entities';
import { ClientService } from '@app/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClientBillResolverService implements Resolve<ClientBill> {

  constructor(private clientService: ClientService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ClientBill | Observable<ClientBill> | Promise<ClientBill> {
    const id = +route.paramMap.get('id');
    const ref = route.paramMap.get('ref');
    return this.clientService.getClientBill(id, ref)
      .catch(e => {
        this.router.navigate(['/professional/clients']);
        return Observable.of(null);
      });
  }

}
