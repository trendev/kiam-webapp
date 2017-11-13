import { WelcomeComponent } from './welcome/welcome/welcome.component';
import { ProfessionalGuard } from './professional.guard';
import { ProfessionalDashboardComponent } from './professional-dashboard/professional-dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProfessionalDashboardComponent,
    canActivate: [ProfessionalGuard],
    children: [{
      path: 'welcome',
      component: WelcomeComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalRoutingModule { }
