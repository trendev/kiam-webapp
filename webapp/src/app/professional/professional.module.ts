import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionalRoutingModule } from './professional-routing.module';
import { ProfessionalDashboardComponent } from './professional-dashboard/professional-dashboard.component';
import { ProfessionalGuard } from './professional.guard';
import { SharedModule } from '@app/shared';
import { ProfessionalToolbarComponent } from './professional-dashboard/professional-toolbar/professional-toolbar.component';
import { WelcomeModule } from './welcome/welcome.module';

@NgModule({
  imports: [
    SharedModule,
    ProfessionalRoutingModule,
    WelcomeModule
  ],
  declarations: [ProfessionalDashboardComponent, ProfessionalToolbarComponent],
  providers: [ProfessionalGuard]
})
export class ProfessionalModule { }
