import { NgModule } from '@angular/core';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses/expenses.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    SharedModule,
    ExpensesRoutingModule
  ],
  declarations: [ExpensesComponent]
})
export class ExpensesModule { }
