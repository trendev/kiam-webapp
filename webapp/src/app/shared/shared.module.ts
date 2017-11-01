import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { MatToolbarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule
  ],
  declarations: [PageNotFoundComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageNotFoundComponent,
    MatToolbarModule
  ]
})

export class SharedModule { }
