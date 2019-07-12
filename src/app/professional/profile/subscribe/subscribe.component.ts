import { finalize, catchError, filter } from 'rxjs/operators';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { StripeSubscriptionService } from '@app/core';
import { ErrorHandlerService } from '@app/error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorMessageComponent, SuccessMessageComponent } from '@app/shared';
import { Router } from '@angular/router';

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
   * Handles the new Stripe Source creation
   * @param _source A Stripe Source
   */
  // TODO : Add 3D secure authentication flow
  handleNewSource(_source) {
    if (_source.card.three_d_secure !== 'required') { // TODO : control based on subscription() response
      if (_source.status === 'chargeable') {
        this.loadingOverlayService.start();
        this.stripeSubscriptionService.subscription(_source)
          .pipe(
            filter(subscription => !!subscription),
            finalize(() => this.loadingOverlayService.stop()), // TODO : stripe.handleCardPayment may take several seconds to complete
            catchError(e => this.errorHandlerService.handle(e, `Une erreur est survenue durant la création de l'abonnement`))
          )
          .subscribe(subscription => {
            // TODO : control subscription.status
            // https://stripe.com/docs/billing/migration/strong-customer-authentication#scenario-1
            this.snackBar.openFromComponent(SuccessMessageComponent,
              {
                data: `Félicitations, la souscription ${subscription.id} est effective 🤗`,
                duration: 3000
              });
            this.router.navigate(['/professional/profile']);
          });
      } else {
        this.snackBar.openFromComponent(ErrorMessageComponent,
          {
            data: `Echec de la souscription: la carte ne peut être débitée 🤔`,
            duration: 3000
          });
      }

    } else { // TODO : should be removed when 3D Secure will be supported
      this.snackBar.openFromComponent(ErrorMessageComponent,
        {
          data: `Echec de la souscription: carte 3D Secure non supportée actuellement 😓`,
          duration: 3000
        });
    }


  }

}
