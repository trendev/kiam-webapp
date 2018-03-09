import { CategoryClientsResolverService } from './category-clients-resolver.service';
import { SharedModule } from '@app/shared';
import { NgModule } from '@angular/core';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryDetailResolverService } from './category-detail-resolver.service';
import {  } from './clients-resolver.service';

@NgModule({
  imports: [
    SharedModule,
    CategoriesRoutingModule
  ],
  declarations: [CategoriesComponent, CreateCategoryComponent, CategoryDetailComponent],
  providers: [CategoryDetailResolverService, CategoryClientsResolverService]
})
export class CategoriesModule { }
