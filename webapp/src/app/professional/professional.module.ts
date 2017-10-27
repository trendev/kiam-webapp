import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionalRoutingModule } from './professional-routing.module';
import { ProfessionalDashboardComponent } from './professional-dashboard/professional-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    ProfessionalRoutingModule
  ],
  declarations: [ProfessionalDashboardComponent]
})
export class ProfessionalModule { }
