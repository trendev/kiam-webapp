import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Category } from '@app/entities';
import { Observable } from 'rxjs/Observable';
import { ProfessionalService } from './professional.service';
import { ErrorHandlerService } from '@app/error-handler.service';


@Injectable()
export class CategoriesResolverService implements Resolve<Category[]> {

  constructor(private professionalService: ProfessionalService,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Category[] | Observable<Category[]> | Promise<Category[]> {
    return this.professionalService.getCategories()
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la liste des catégories...`);
        return Observable.of([]);
      });
  }

}
