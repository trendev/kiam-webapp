import { CreateCategoryComponent } from './create-category/create-category.component';
import { CategoriesComponent } from './categories/categories.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';
import { CategoriesResolverService } from '@app/core';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    pathMatch: 'full',
    resolve: {
      categories: CategoriesResolverService
    }
  },
  {
    path: 'create-category',
    component: CreateCategoryComponent,
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
