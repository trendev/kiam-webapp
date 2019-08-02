import { catchError, filter, take, finalize, tap } from 'rxjs/operators';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { StripeSubscriptionService } from '@app/core';
import { ErrorHandlerService } from '@app/error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorMessageComponent, SuccessMessageComponent } from '@app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { from, Subject } from 'rxjs';
import { stripe } from '@app/app.component';
import { StripePlan } from './stripe-plan.model';
import * as moment from 'moment';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  appName = environment.title;

  private control = new Subject<string>();
  private paymentControllers: ((subscription: any) => void)[] = [];

  plans: StripePlan[] = [];

  constructor(private loadingOverlayService: LoadingOverlayService,
    private errorHandlerService: ErrorHandlerService,
    private stripeSubscriptionService: StripeSubscriptionService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.data.subscribe(
      (data: {
        stripePlans: any,
        stripePaymentMethods: any
      }) => {
        this.plans = data.stripePlans.data.map(p => new StripePlan({
          id: p.id,
          title: p.nickname,
          amount: p.amount * 1.2,
          interval: p.interval,
          interval_count: p.interval_count
        }));
      }
    );
  }

  ngOnInit() {
    this.paymentControllers.push((s) => this.controlPaymentSuccess(s));
    this.paymentControllers.push((s) => this.controlPaymentRequiredCustomerAction(s));
    this.paymentControllers.push((s) => this.controlPaymentFailure(s));

    this.control.pipe(
      take(1),
      tap(m => console.log(m))
    ).subscribe(m => this.router.navigate(['/professional/profile']));
  }

  /**
   * Handles the new Stripe PaymentMethod creation
   * @param newStripePaymentMethod A Stripe Payment Method
   */
  handleNewStripePaymentMethod(newStripePaymentMethod: any) {
    if (newStripePaymentMethod.type === 'card') {
      this.loadingOverlayService.start();
      this.stripeSubscriptionService.subscription(newStripePaymentMethod)
        .pipe(
          filter(subscription => !!subscription),
          catchError(e => {
            this.loadingOverlayService.stop();
            return this.errorHandlerService.handle(e, `Une erreur est survenue durant la création de l'abonnement 🤔`);
          })
        )
        .subscribe(subscription => {
          this.loadingOverlayService.stop();
          this.controlPayment(subscription);
        });

    } else {
      this.snackBar.openFromComponent(ErrorMessageComponent,
        {
          data: `Echec de la souscription: nous ne supportons qu les cartes de paiement 3D Secure 😓`,
          duration: 3000
        });
    }
  }

  private controlPayment(subscription: any) {
    this.paymentControllers.forEach(controller => controller(subscription));
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
      this.control.next('controlPaymentSuccess');
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
      this.control.next('controlPaymentFailure');
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
          finalize(() => this.control.next('controlPaymentRequiredCustomerAction')),
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

  private computeDuration(plan: StripePlan): moment.Duration {
    return moment.duration(plan.interval_count, plan.interval as moment.DurationInputArg2);
  }

  displayRenewalInterval(plan: StripePlan): string {
    moment.locale('fr');
    return this.computeDuration(plan).humanize(true);
  }

  displayRenewalUnit(plan: StripePlan): string {
    moment.defineLocale('fr-subscription', {
      parentLocale: 'fr'
    });
    moment.updateLocale('fr-subscription', {
      relativeTime: {
        M: 'mois',
        y: 'an'
      }
    });
    return this.computeDuration(plan).humanize(false);
  }

  controlPlansDisplay(id: string) {
    console.log(`should refresh for ${id}`);
    this.plans = this.plans.map(p => {
      const p_ = { ...p };
      p_.display = (p_.id === id);
      return p_;
    });
  }

}
