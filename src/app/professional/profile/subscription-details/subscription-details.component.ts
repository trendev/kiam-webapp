import { RescissionConfirmationDialogComponent } from './rescission-confirmation-dialog/rescission-confirmation-dialog.component';
import { StripePaymentMethod } from './stripe-payment-method.model';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StripeCustomer } from './stripe-customer.model';
import { StripeSubscription } from './stripe-subscription.model';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { ErrorHandlerService } from '@app/error-handler.service';
import { StripeSubscriptionService, StripePaymentMethodService } from '@app/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, finalize, catchError, map, switchMap } from 'rxjs/operators';
import { SuccessMessageComponent, ErrorMessageComponent } from '@app/shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent {

  customer: StripeCustomer;
  private _paymentMethods: StripePaymentMethod[];

  constructor(private loadingOverlayService: LoadingOverlayService,
    private errorHandlerService: ErrorHandlerService,
    private stripeSubscriptionService: StripeSubscriptionService,
    private stripePaymentMethodService: StripePaymentMethodService,
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
        this.formatStripePaymentMethod(data.stripePaymentMethods.data);
      }
    );
  }

  private formatStripePaymentMethod(data: any) {
    this._paymentMethods = data.map(pm => new StripePaymentMethod({
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

  get paymentMethods(): StripePaymentMethod[] {
    return this._paymentMethods.sort(
      (pm1, pm2) => {
        // compares the expiration date
        // exp_year and exp_month are string and converted to number
        // month in date begins with index 0 and must be decrease
        const d1 = new Date(+pm1.exp_year, +pm1.exp_month - 1);
        const d2 = new Date(+pm2.exp_year, +pm2.exp_month - 1);
        // sort the most recent first
        return d2.getTime() - d1.getTime();
      }
    );
  }

  private handlePaymentMethod(paymentMethod: any,
    fn: (a: any) => Observable<any>,
    successMsg: string,
    errMsg: string) {
    this.loadingOverlayService.start();
    fn(paymentMethod)
      .pipe(
        filter(c => !!c),
        map(c => StripeCustomer.build(c)),
        switchMap(c => {
          this.customer = c;
          return this.stripePaymentMethodService.getPaymentMethods();
        }),
        finalize(() => this.loadingOverlayService.stop()),
        catchError(e => this.errorHandlerService.handle(e, errMsg))
      )
      .subscribe(paymentMethods => {
        this.formatStripePaymentMethod(paymentMethods.data);
        this.snackBar.openFromComponent(SuccessMessageComponent,
          {
            data: successMsg,
            duration: 3000
          });
      });
  }

  detachPaymentMethod(id: string) {
    this.handlePaymentMethod(id,
      (_id: string) => this.stripePaymentMethodService.detach(_id),
      `Félicitations, le moyen de paiement ${id} est maintenant supprimée 😉`,
      `Impossible de supprimer ce moyen de paiement...`
    );
  }

  addPaymentMethod(seti: any) {
    this.handlePaymentMethod(seti.payment_method,
      (_id: string) => this.stripePaymentMethodService.add(_id),
      `Félicitations, le nouveau moyen de paiement est ajouté 👍`,
      `Impossible d'ajouter ce moyen de paiement...`);
  }

  setAsDefaultPaymentMethod(id: string) {
    this.handlePaymentMethod(id,
      (_id: string) => this.stripePaymentMethodService.default(_id),
      `Félicitations, le moyen de paiement ${id} est maintenant le moyen de paiement par défaut 👍`,
      `Impossible de choisir ce moyen de paiment comme moyen par défaut...`
    );
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


