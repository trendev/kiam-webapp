import { Injectable } from '@angular/core';
import { ProfessionalService } from '@app/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ErrorHandlerService } from '@app/error-handler.service';
import { Category } from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CategoryDetailResolverService implements Resolve<Category> {

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Category | Observable<Category> | Promise<Category> {
    const id = +route.paramMap.get('id');
    return this.professionalService.getCategories()
      .map(categories => {
        const ct = categories.filter(c => c.id === id).pop();
        if (ct) {
          return ct;
        } else {
          console.warn(`Category ${id} does not exist !`);
          this.router.navigate(['/professional/categories']);
          return null;
        }
      })
      .catch(e => {
        this.errorHandler.handle(e, `Impossible de récupérer le détail de la catégorie ${id}...`);
        this.router.navigate(['/professional/categories']);
        return Observable.of(null);
      });
  }

}
