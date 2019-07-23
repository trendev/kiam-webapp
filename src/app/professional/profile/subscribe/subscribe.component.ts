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
   * Handles the new Stripe Token creation
   * @param token A Stripe Token
   */
  handleNewToken(token: any) {
    console.log(token);
    if (token.type === 'card') {
      this.loadingOverlayService.start();
      this.stripeSubscriptionService.subscription(token)
        .pipe(
          filter(subscription => !!subscription),
          catchError(e => this.errorHandlerService.handle(e, `Une erreur est survenue durant la création de l'abonnement 🤔`))
        )
        .subscribe(subscription => {
          this.loadingOverlayService.stop();
          console.log(subscription);
          if (subscription
            && subscription.status === 'active'
            && subscription.latest_invoice
            && subscription.latest_invoice.payment_intent
            && subscription.latest_invoice.payment_intent.status === 'succeeded') {
            this.snackBar.openFromComponent(SuccessMessageComponent,
              {
                data: `Félicitations, la souscription ${subscription.id} est effective 🤗`,
                duration: 2000
              });
            this.router.navigate(['/professional/profile']);
          } else {
            // TODO : handle 3D Secure here
            this.snackBar.openFromComponent(ErrorMessageComponent,
              {
                data: `Echec de la souscription: la carte ne peut être débitée 🤔`,
                duration: 3000
              });
          }

        });

    } else {
      this.snackBar.openFromComponent(ErrorMessageComponent,
        {
          data: `Echec de la souscription: ne supportons que les carte de crédit 3D Secure😓`,
          duration: 3000
        });
    }


  }

}
