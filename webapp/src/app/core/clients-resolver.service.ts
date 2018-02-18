import { ErrorHandlerService } from '@app/error-handler.service';
import { ProfessionalService } from './professional.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Client } from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClientsResolverService implements Resolve<Client[]> {

  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Client[] | Observable<Client[]> | Promise<Client[]> {
    return this.professionalService.getClients()
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la liste des clients...`);
        return Observable.of([]);
      });
  }

}
