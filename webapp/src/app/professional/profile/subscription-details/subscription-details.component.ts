import { StripeSource } from './stripe-source.model';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StripeCustomer } from './stripe-customer.model';
import { StripeSubscription } from './stripe-subscription.model';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { ErrorHandlerService } from '@app/error-handler.service';
import { StripeSubscriptionService } from '@app/core';
import { MatSnackBar } from '@angular/material';
import { filter, finalize, catchError } from 'rxjs/operators';
import { SuccessMessageComponent, ErrorMessageComponent } from '@app/shared';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent {

  customer: StripeCustomer;

  constructor(private loadingOverlayService: LoadingOverlayService,
    private errorHandlerService: ErrorHandlerService,
    private stripeSubscriptionService: StripeSubscriptionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {
    this.route.data.subscribe(
      (data: {
        stripeCustomer: any
      }) => {
        const inputCust = data.stripeCustomer;
        this.customer = StripeCustomer.build(inputCust);
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
    if (_source.card.three_d_secure !== 'required') {
      if (_source.status === 'chargeable') {
        this.loadingOverlayService.start();
        this.stripeSubscriptionService.addSource(_source)
          .pipe(
            filter(c => !!c),
            finalize(() => this.loadingOverlayService.stop()),
            catchError(e => this.errorHandlerService.handle(e))
          )
          .subscribe(c => {
            this.snackBar.openFromComponent(SuccessMessageComponent,
              {
                data: `Félicitations, la nouvelle source est ajoutée 👍`,
                duration: 3000
              });
            this.customer = StripeCustomer.build(c);
          });
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
}


