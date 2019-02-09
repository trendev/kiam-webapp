import { NgModule } from '@angular/core';

import { ProfessionalRoutingModule } from './professional-routing.module';
import { ProfessionalDashboardComponent } from './professional-dashboard/professional-dashboard.component';
import { ProfessionalGuard } from './professional.guard';
import { SharedModule } from '@app/shared';
import { ProfessionalToolbarComponent } from './professional-dashboard/professional-toolbar/professional-toolbar.component';
import { ProfessionalSidenavComponent } from './professional-dashboard/professional-sidenav/professional-sidenav.component';

@NgModule({
  imports: [
    SharedModule,
    ProfessionalRoutingModule,
  ],
  declarations: [ProfessionalDashboardComponent, ProfessionalToolbarComponent, ProfessionalSidenavComponent],
  providers: [ProfessionalGuard]
})
export class ProfessionalModule { }
