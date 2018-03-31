import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { CustomMatPaginatorIntlFr } from './custom-mat-paginator-intl/custom-mat-paginator-intl-fr';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatListModule,
  MatChipsModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatPaginatorIntl,
  MatDialogModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AddressComponent } from './address/address.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { BusinessesComponent } from './businesses/businesses.component';
import { PaymentModesComponent } from './payment-modes/payment-modes.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { SocialNetworkAccountsComponent } from './social-network-accounts/social-network-accounts.component';
import { LoremIpsumComponent } from './lorem-ipsum/lorem-ipsum.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ErrorAggregatorDirective } from './error-aggregator.directive';
import { CategoriesComponent } from './categories/categories.component';
import { ErrorComponent } from './error/error.component';
import { CommentsComponent } from './comments/comments.component';
import { PhoneComponent } from './phone/phone.component';
import { PhonePipe } from './phone.pipe';
import { SuccessMessageComponent } from './snack-messages/success-message/success-message.component';
import { ErrorMessageComponent } from './snack-messages/error-message/error-message.component';
import { UnexpectedErrorComponent } from './snack-messages/unexpected-error/unexpected-error.component';
import { BillsMicroListTableComponent } from './bills/bills-micro-list-table/bills-micro-list-table.component';
import { BillsMicroListComponent } from './bills/bills-micro-list/bills-micro-list.component';
import { PeriodSelectorComponent } from './bills/period-selector/period-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    OverlayModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDialogModule
  ],
  declarations: [
    PageNotFoundComponent,
    AccountInfoComponent,
    AddressComponent,
    CustomerDetailsComponent,
    BusinessesComponent,
    PaymentModesComponent,
    CompanyInformationComponent,
    SocialNetworkAccountsComponent,
    LoremIpsumComponent,
    ChangePasswordComponent,
    ErrorAggregatorDirective,
    CategoriesComponent,
    ErrorComponent,
    CommentsComponent,
    PhoneComponent,
    PhonePipe,
    SuccessMessageComponent,
    ErrorMessageComponent,
    UnexpectedErrorComponent,
    BillsMicroListComponent,
    BillsMicroListTableComponent,
    PeriodSelectorComponent,
    PaymentStatusComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageNotFoundComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule,
    AccountInfoComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    AddressComponent,
    MatRadioModule,
    CustomerDetailsComponent,
    BusinessesComponent,
    PaymentModesComponent,
    CompanyInformationComponent,
    SocialNetworkAccountsComponent,
    LoremIpsumComponent,
    ChangePasswordComponent,
    ErrorAggregatorDirective,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CategoriesComponent,
    ErrorComponent,
    MatProgressBarModule,
    CommentsComponent,
    MatSelectModule,
    OverlayModule,
    MatProgressSpinnerModule,
    PhoneComponent,
    PhonePipe,
    MatSnackBarModule,
    SuccessMessageComponent,
    ErrorMessageComponent,
    UnexpectedErrorComponent,
    MatSlideToggleModule,
    BillsMicroListComponent,
    BillsMicroListTableComponent,
    MatDialogModule,
    PeriodSelectorComponent,
    PaymentStatusComponent
  ],
  entryComponents: [
    SuccessMessageComponent,
    ErrorMessageComponent,
    UnexpectedErrorComponent
  ]
})

export class SharedModule { }
