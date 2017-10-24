import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent, SharedModule } from '@app/shared';

export const routes: Routes = [
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(
            routes,
            { enableTracing: true } // <-- debugging purposes only
        )],
    exports: [RouterModule]
})

export class AppRoutingModule { }
