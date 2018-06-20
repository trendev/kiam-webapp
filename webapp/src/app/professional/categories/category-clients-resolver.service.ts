import { catchError } from 'rxjs/operators/catchError';
import { Client } from '@app/entities';
import { CategoryService } from '@app/core/category.service';
import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ErrorHandlerService } from '@app/error-handler.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class CategoryClientsResolverService implements Resolve<Client[]> {
  constructor(private categoryService: CategoryService,
    private router: Router,
    private errorHandler: ErrorHandlerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Client[] | Observable<Client[]> | Promise<Client[]> {
    const id = +route.paramMap.get('id');
    return this.categoryService.getClients(id).pipe(
      catchError(e => {
        this.errorHandler.handle(e, `Impossible de récupérer la liste des clients de la catégorie ${id}...`);
        this.router.navigate(['/professional/categories']);
        return of([]);
      })
    );
  }

}
