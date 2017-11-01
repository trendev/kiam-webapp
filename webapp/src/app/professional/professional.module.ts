import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionalRoutingModule } from './professional-routing.module';
import { ProfessionalDashboardComponent } from './professional-dashboard/professional-dashboard.component';
import { ProfessionalGuard } from './professional.guard';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    SharedModule,
    ProfessionalRoutingModule
  ],
  declarations: [ProfessionalDashboardComponent],
  providers: [ProfessionalGuard]
})
export class ProfessionalModule { }
