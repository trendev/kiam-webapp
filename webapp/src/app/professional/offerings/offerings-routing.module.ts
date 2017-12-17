import { PackDetailResolverService } from './pack-detail-resolver.service';
import { PackDetailComponent } from './pack-detail/pack-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferingsComponent } from './offerings/offerings.component';
import { OfferingsResolverService } from '@app/core';
import { PageNotFoundComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: OfferingsComponent,
    pathMatch: 'full',
    resolve: {
      offerings: OfferingsResolverService
    }
  },
  {
    path: 'pack/:id',
    component: PackDetailComponent,
    resolve: {
      pack: PackDetailResolverService,
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferingsRoutingModule { }
