import { StripeSource } from './stripe-source.model';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StripeCustomer } from './stripe-customer.model';
import { StripeSubscription } from './stripe-subscription.model';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent {

  customer: StripeCustomer;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(
      (data: {
        stripeCustomer: any
      }) => {
        const inputCust = data.stripeCustomer;
        const inputSub = inputCust.subscriptions.data[0];
        this.customer = new StripeCustomer(
          inputCust.id,
          inputCust.created,
          inputCust.default_source,
          new StripeSubscription(
            inputSub.id,
            inputSub.billing_cycle_anchor,
            inputSub.cancel_at_period_end,
            inputSub.canceled_at,
            inputSub.created,
            inputSub.current_period_end,
            inputSub.current_period_start,
            inputSub.plan.nickname,
            inputSub.plan.amount,
            inputSub.tax_percent,
            !!inputSub.discount,
            inputSub.discount ? inputSub.discount.coupon.percent_off : undefined
          ),
          inputCust.sources.data.map(s =>
            new StripeSource(
              s.id,
              s.status,
              s.type,
              s.type_data.brand,
              s.type_data.exp_month,
              s.type_data.exp_year,
              s.type_data.last4,
              s.type_data.three_d_secure,
              s.id === inputCust.default_source
            )
          )
        );
      }
    );
  }

  get sources(): StripeSource[] {
    return this.customer.sources;
  }

  setAsDefaultSource(id: string) {
    console.warn(`setting ${id} as default source`);
  }

  removeSource(id: string) {
    console.warn(`removing ${id}`);
  }

    /**
   * Handles the new Stripe Source creation
   * @param _source A Stripe Source
   */
  handleNewSource(_source) {
    // if (_source.card.three_d_secure !== 'required') {
    //   if (_source.status === 'chargeable') {
    //     this.loadingOverlayService.start();
    //     this.stripeSubscriptionService.subscription(_source)
    //       .pipe(
    //         filter(src => !!src),
    //         // map(src => this.source = src),
    //         finalize(() => this.loadingOverlayService.stop()),
    //         catchError(e => this.errorHandlerService.handle(e))
    //       )
    //       .subscribe(src => {
    //         this.snackBar.openFromComponent(SuccessMessageComponent,
    //           {
    //             data: `Félicitations, la souscription ${src.id} est effective 🤗`,
    //             duration: 3000
    //           });
    //         this.router.navigate(['/professional/profile']);
    //       });
    //   } else {
    //     this.snackBar.openFromComponent(ErrorMessageComponent,
    //       {
    //         data: `Echec de la souscription: la carte ne peut être débitée 🤔`,
    //         duration: 3000
    //       });
    //   }

    // } else {
    //   this.snackBar.openFromComponent(ErrorMessageComponent,
    //     {
    //       data: `Echec de la souscription: carte 3D Secure non supportée actuellement 😓`,
    //       duration: 3000
    //     });
    // }


  }
}


