import { CoreModule } from './core.module';
import { ProfessionalService } from './professional.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Professional } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: CoreModule
})
export class ProfessionalProfileResolverService implements Resolve<Professional> {

  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Professional | Observable<Professional> | Promise<Professional> {
    return this.professionalService.profile().pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer ton profil...`);
        return of(null);
      }));
  }


}
