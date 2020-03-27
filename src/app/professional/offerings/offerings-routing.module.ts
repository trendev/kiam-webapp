import { CreateServiceComponent } from './create-service/create-service.component';
import { ServiceParentPacksResolverService } from './service-parent-packs-resolver.service';
import { ServiceDetailResolverService } from './service-detail-resolver.service';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { CreatePackComponent } from './create-pack/create-pack.component';
import { PackParentPacksResolverService } from './pack-parent-packs-resolver.service';
import { PackDetailResolverService } from './pack-detail-resolver.service';
import { PackDetailComponent } from './pack-detail/pack-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferingsComponent } from './offerings/offerings.component';
import { OfferingsResolverService, ProfessionalBusinessesResolverService } from '@app/core';
import { PageNotFoundComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: OfferingsComponent,
    pathMatch: 'full',
    resolve: {
      offerings: OfferingsResolverService,
      businesses: ProfessionalBusinessesResolverService,
    }
  },
  {
    path: 'pack/:id',
    component: PackDetailComponent,
    resolve: {
      pack: PackDetailResolverService,
      parentPacks: PackParentPacksResolverService,
      businesses: ProfessionalBusinessesResolverService,
      offerings: OfferingsResolverService
    }
  },
  {
    path: 'service/:id',
    component: ServiceDetailComponent,
    resolve: {
      service: ServiceDetailResolverService,
      parentPacks: ServiceParentPacksResolverService,
      businesses: ProfessionalBusinessesResolverService,
    }
  },
  {
    path: 'create-pack',
    component: CreatePackComponent,
    resolve: {
      businesses: ProfessionalBusinessesResolverService,
      offerings: OfferingsResolverService
    }
  },
  {
    path: 'create-service',
    component: CreateServiceComponent,
    resolve: {
      businesses: ProfessionalBusinessesResolverService
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferingsRoutingModule { }
