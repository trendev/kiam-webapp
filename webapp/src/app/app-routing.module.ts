import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'professional',
        loadChildren: 'app/professional/professional.module#ProfessionalModule'
    },
    {
        path: 'individual',
        loadChildren: 'app/individual/individual.module#IndividualModule'
    },
    {
        path: 'administrator',
        loadChildren: 'app/administrator/administrator.module#AdministratorModule'
    },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            {
                // enableTracing: true, // <-- debugging purposes only
                preloadingStrategy: PreloadAllModules,
                // useHash: true
            }
        )],
    exports: [RouterModule]
})

export class AppRoutingModule { }
