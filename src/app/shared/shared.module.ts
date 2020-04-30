import { StripePaymentMethodTypeComponent } from './stripe-payment-method-type/stripe-payment-method-type.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AddressComponent } from './address/address.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { BusinessesComponent } from './businesses/businesses.component';
import { PaymentModesComponent } from './payment-modes/payment-modes.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { SocialNetworkAccountsComponent } from './social-network-accounts/social-network-accounts.component';
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
import { CardInfoComponent } from './card-info/card-info.component';
import { CardInfoWrapperComponent } from './card-info-wrapper/card-info-wrapper.component';
import { TwitterSvgIconComponent } from './icons/twitter-svg-icon/twitter-svg-icon.component';
import { FacebookSvgIconComponent } from './icons/facebook-svg-icon/facebook-svg-icon.component';

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
    PaymentStatusComponent,
    CardInfoComponent,
    CardInfoWrapperComponent,
    TwitterSvgIconComponent,
    FacebookSvgIconComponent,
    StripePaymentMethodTypeComponent
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
    PaymentStatusComponent,
    CardInfoComponent,
    CardInfoWrapperComponent,
    TwitterSvgIconComponent,
    FacebookSvgIconComponent,
    StripePaymentMethodTypeComponent
  ]
})

export class SharedModule { }
