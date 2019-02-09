import { finalize, catchError, filter } from 'rxjs/operators';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { StripeSubscriptionService } from '@app/core';
import { ErrorHandlerService } from '@app/error-handler.service';
import { MatSnackBar } from '@angular/material';
import { ErrorMessageComponent, SuccessMessageComponent } from '@app/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  appName = environment.title;

  // default subscription amount (18 euros all taxes included)
  defaultAmount = 1800;

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
  handleNewSource(_source) {
    if (_source.card.three_d_secure !== 'required') {
      if (_source.status === 'chargeable') {
        this.loadingOverlayService.start();
        this.stripeSubscriptionService.subscription(_source)
          .pipe(
            filter(src => !!src),
            finalize(() => this.loadingOverlayService.stop()),
            catchError(e => this.errorHandlerService.handle(e))
          )
          .subscribe(src => {
            this.snackBar.openFromComponent(SuccessMessageComponent,
              {
                data: `Félicitations, la souscription ${src.id} est effective 🤗`,
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

    } else {
      this.snackBar.openFromComponent(ErrorMessageComponent,
        {
          data: `Echec de la souscription: carte 3D Secure non supportée actuellement 😓`,
          duration: 3000
        });
    }


  }

}
