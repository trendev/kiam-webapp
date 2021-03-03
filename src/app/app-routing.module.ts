import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';

export const routes: Routes = [
    // Uncomment the following paths if the welcome module is the default one
    // {
    //     path: '',
    //     redirectTo: '/welcome',
    //     pathMatch: 'full',
    // },
    // {
    //     path: 'login',
    //     redirectTo: '/login'
    // },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'professional',
        loadChildren: () => import('app/professional/professional.module').then(m => m.ProfessionalModule)
    },
    {
        path: 'individual',
        loadChildren: () => import('app/individual/individual.module').then(m => m.IndividualModule)
    },
    {
        path: 'administrator',
        loadChildren: () => import('app/administrator/administrator.module').then(m => m.AdministratorModule)
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
    relativeLinkResolution: 'legacy'
}
        )],
    exports: [RouterModule]
})

export class AppRoutingModule { }
