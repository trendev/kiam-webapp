import { catchError, filter, take, finalize } from 'rxjs/operators';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { StripeSubscriptionService } from '@app/core';
import { ErrorHandlerService } from '@app/error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorMessageComponent, SuccessMessageComponent } from '@app/shared';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  appName = environment.title;

  // basic subscription amount (6 euros - all taxes included)
  defaultAmount = 600;

  constructor(private loadingOverlayService: LoadingOverlayService,
    private errorHandlerService: ErrorHandlerService,
    private stripeSubscriptionService: StripeSubscriptionService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
  }

  /**
   * Handles the new Stripe Token creation
   * @param token A Stripe Token
   */
  handleNewToken(token: any) {
    if (token.type === 'card') {
      this.loadingOverlayService.start();
      this.stripeSubscriptionService.subscription(token)
        .pipe(
          filter(subscription => !!subscription),
          catchError(e => {
            this.loadingOverlayService.stop();
            return this.errorHandlerService.handle(e, `Une erreur est survenue durant la création de l'abonnement 🤔`);
          })
        )
        .subscribe(subscription => {
          this.loadingOverlayService.stop();
          this.controlPaymentSuccess(subscription);
          this.controlPaymentRequiredCustomerAction(subscription);
          this.controlPaymentFailure(subscription);
        });

    } else {
      this.snackBar.openFromComponent(ErrorMessageComponent,
        {
          data: `Echec de la souscription: nous ne supportons que les cartes de paiement 3D Secure 😓`,
          duration: 3000
        });
    }
  }

  private controlPaymentSuccess(subscription: any) {
    if (subscription.status === 'active'
      && subscription.latest_invoice
      && subscription.latest_invoice.status === 'paid'
      && subscription.latest_invoice.payment_intent
      && subscription.latest_invoice.payment_intent.status === 'succeeded') {
      this.snackBar.openFromComponent(SuccessMessageComponent,
        {
          data: `Félicitations, la souscription ${subscription.id} est effective 🤗`,
          duration: 3000
        });
      this.router.navigate(['/professional/profile']);
    }
  }

  private controlPaymentFailure(subscription: any) {
    if (subscription.status === 'incomplete'
      && subscription.latest_invoice
      && subscription.latest_invoice.status === 'open'
      && subscription.latest_invoice.payment_intent
      && subscription.latest_invoice.payment_intent.status === 'requires_payment_method') {
      this.snackBar.openFromComponent(ErrorMessageComponent,
        {
          data: `Echec de la souscription: la carte est déclinée et ne peut être débitée!\n
          Merci de renseigner un nouveau moyen de paiement.`,
          duration: 3000
        });
      this.router.navigate(['/professional/profile']);
    }
  }

  private controlPaymentRequiredCustomerAction(subscription: any) {
    if (subscription.status === 'incomplete'
      && subscription.latest_invoice
      && subscription.latest_invoice.status === 'open'
      && subscription.latest_invoice.payment_intent
      && subscription.latest_invoice.payment_intent.status === 'requires_action') {

      const paymentIntentSecret = subscription.latest_invoice.payment_intent.client_secret;

      this.snackBar.openFromComponent(SuccessMessageComponent,
        {
          data: `Activation de la validation DYNAMIC 3D SECURE 🔐`,
          duration: 10000
        });

      this.loadingOverlayService.start();

      from(stripe.handleCardPayment(paymentIntentSecret))
        .pipe(
          take(1),
          finalize(() => this.router.navigate(['/professional/profile'])),
          catchError(e => {
            this.loadingOverlayService.stop();
            return this.errorHandlerService.handle(e, `Une erreur est survenue lors de la validation de la carte 🤔`);
          }))
        .subscribe(({ paymentIntent, error }) => {
          this.loadingOverlayService.stop();
          if (!!error) {
            this.snackBar.openFromComponent(ErrorMessageComponent,
              {
                data: `Une erreur est survenue lors de la validation de la carte : ${error.message}`,
                duration: 3000
              });
          } else {
            this.snackBar.openFromComponent(SuccessMessageComponent,
              {
                data: `Félicitations, la souscription ${subscription.id} est effective et le paiement ${paymentIntent.id} est validé ✅`,
                duration: 5000
              });
          }
        });

    }

  }
}
