import { Injectable } from '@angular/core';
import { ProfessionalService } from '@app/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ClientBill } from '@app/entities';

@Injectable()
export class ClientBillsResolverService implements Resolve<ClientBill[]> {

  constructor(private professionalService: ProfessionalService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ClientBill[] | Observable<ClientBill[]> | Promise<ClientBill[]> {
    const id = +route.paramMap.get('id');
    return null;
  }

}
