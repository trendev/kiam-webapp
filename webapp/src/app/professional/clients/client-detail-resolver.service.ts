import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Client } from '@app/entities';
import { ProfessionalService } from '@app/core';
import { Observable, of } from 'rxjs';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class ClientDetailResolverService implements Resolve<Client> {


  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Client | Observable<Client> | Promise<Client> {
    const id = +route.paramMap.get('id');
    return this.professionalService.getClients().pipe(
      map(clients => {
        const client = clients.filter(c => c.id === id).pop();
        if (client) {
          return client;
        } else {
          console.warn(`Client ${id} does not exist !`);
          this.router.navigate(['/professional/clients']);
          return null;
        }
      }),
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la fiche du client ${id}...`);
        this.router.navigate(['/professional/clients']);
        return of(null);
      })
    );
  }

}
