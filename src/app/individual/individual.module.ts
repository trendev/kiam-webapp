import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndividualRoutingModule } from './individual-routing.module';
import { IndividualDashboardComponent } from './individual-dashboard/individual-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    IndividualRoutingModule
  ],
  declarations: [IndividualDashboardComponent]
})
export class IndividualModule { }
