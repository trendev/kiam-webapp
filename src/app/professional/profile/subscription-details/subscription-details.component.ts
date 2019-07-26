import { RescissionConfirmationDialogComponent } from './rescission-confirmation-dialog/rescission-confirmation-dialog.component';
import { StripePaymentMethod } from './stripe-payment-method.model';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StripeCustomer } from './stripe-customer.model';
import { StripeSubscription } from './stripe-subscription.model';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { ErrorHandlerService } from '@app/error-handler.service';
import { StripeSubscriptionService } from '@app/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, finalize, catchError, map } from 'rxjs/operators';
import { SuccessMessageComponent, ErrorMessageComponent } from '@app/shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent {

  customer: StripeCustomer;
  paymentMethods: StripePaymentMethod[];

  constructor(private loadingOverlayService: LoadingOverlayService,
    private errorHandlerService: ErrorHandlerService,
    private stripeSubscriptionService: StripeSubscriptionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.route.data.subscribe(
      (data: {
        stripeCustomer: any,
        stripePaymentMethods: any
      }) => {
        const inputCust = data.stripeCustomer;
        this.customer = StripeCustomer.build(inputCust);
        this.paymentMethods = data.stripePaymentMethods.data.map(pm => new StripePaymentMethod({
          id: pm.id,
          type: pm.type,
          brand: pm[pm.type].brand,
          exp_month: pm[pm.type].exp_month,
          exp_year: pm[pm.type].exp_year,
          last4: pm[pm.type].last4,
          three_d_secure: pm[pm.type].three_d_secure_usage.supported,
          is_default: this.customer.default_payment_method === pm.id
        }));
      }
    );
  }

  get sources(): StripePaymentMethod[] {
    return this.paymentMethods.sort(
      (s1, s2) => {
        // compares the expiration date
        // exp_year and exp_month are string and converted to number
        // month in date begins with index 0 and must be decrease
        const d1 = new Date(+s1.exp_year, +s1.exp_month - 1);
        const d2 = new Date(+s2.exp_year, +s2.exp_month - 1);
        // sort the most recent first
        return d2.getTime() - d1.getTime();
      }
    );
  }

  private handleSource(source: any, fn: (s: any) => Observable<any>, msg: string) {
    this.loadingOverlayService.start();
    fn.apply(this.stripeSubscriptionService, [source])
      .pipe(
        filter(c => !!c),
        map(c => StripeCustomer.build(c)),
        finalize(() => this.loadingOverlayService.stop()),
        catchError(e => this.errorHandlerService.handle(e))
      )
      .subscribe(c => {
        this.snackBar.openFromComponent(SuccessMessageComponent,
          {
            data: msg,
            duration: 3000
          });
        this.customer = c;
      });
  }

  setAsDefaultSource(id: string) {
    this.handleSource(id,
      this.stripeSubscriptionService.defaultSource,
      `Félicitations, la source ${id} est maintenant la source par défaut 👍`
    );
  }

  detachSource(id: string) {
    this.handleSource(id,
      this.stripeSubscriptionService.detachSource,
      `Félicitations, la source ${id} est maintenant supprimée 😉`
    );
  }

  /**
  * Handles the new Stripe Source creation
  * @param _source A Stripe Source
  */
  addSource(_source) {
    if (_source.card.three_d_secure !== 'required') {
      if (_source.status === 'chargeable') {
        this.handleSource(_source,
          this.stripeSubscriptionService.addSource,
          `Félicitations, la nouvelle source est ajoutée 👍`);
      } else {
        this.snackBar.openFromComponent(ErrorMessageComponent,
          {
            data: `Echec d'ajout d'une source: la carte ne peut être débitée 🤔`,
            duration: 3000
          });
      }

    } else {
      this.snackBar.openFromComponent(ErrorMessageComponent,
        {
          data: `Echec d'ajout d'une source: carte 3D Secure non supportée actuellement 😓`,
          duration: 3000
        });
    }
  }

  get isRescinded(): boolean {
    return !!this.customer.subscription.canceled_at;
  }

  private manageRescission(fn: () => Observable<any>, msg: string) {
    this.loadingOverlayService.start();
    fn().pipe(
      filter(s => !!s),
      map(s => StripeSubscription.build(s)),
      finalize(() => this.loadingOverlayService.stop()),
      catchError(e => this.errorHandlerService.handle(e))
    )
      .subscribe(s => {
        this.snackBar.openFromComponent(SuccessMessageComponent,
          {
            data: msg,
            duration: 3000
          });
        this.customer.subscription = s;
      });
  }

  rescind() {
    const dialogRef = this.dialog.open(RescissionConfirmationDialogComponent, {
      disableClose: false // if true backdrop click or ESC won't close
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!!result) { // result = empty string if user click OK / undefined otherwise
          this.manageRescission(
            () => this.stripeSubscriptionService.rescind(),
            `Et voilà, l'abonnement est maintenant suspendu 😢`
          );
        }
      });
  }

  reactivate() {
    this.manageRescission(
      () => this.stripeSubscriptionService.reactivate(),
      `L'abonnement est réactivé 👏 😇`
    );
  }
}


