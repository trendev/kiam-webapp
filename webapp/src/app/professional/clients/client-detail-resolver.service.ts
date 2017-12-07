import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Client } from '@app/entities';
import { ProfessionalService } from '@app/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClientDetailResolverService implements Resolve<Client> {


  constructor(private professionalService: ProfessionalService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Client | Observable<Client> | Promise<Client> {
    const id = +route.paramMap.get('id');
    return this.professionalService.getClients()
      .map(clients => {
        const client = clients.filter(c => c.id === id).pop();
        if (client) {
          return client;
        } else {
          console.warn(`Client ${id} does not exist !`);
          this.router.navigate(['../']);
          return null;
        }

      });
  }

}
