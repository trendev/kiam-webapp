import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forRoot(
        routes,
        { enableTracing: true } // <-- debugging purposes only
    )],
    exports: [RouterModule]
})

export class AppRoutingModule { }
