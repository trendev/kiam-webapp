import { finalize, catchError, take, filter } from 'rxjs/operators';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { StripeSubscriptionService } from '@app/core';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from '@app/error-handler.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  appName = environment.title;
  source$: Observable<any>;

  defaultAmount = 24;

  constructor(private loadingOverlayService: LoadingOverlayService,
    private errorHandlerService: ErrorHandlerService,
    private stripeSubscriptionService: StripeSubscriptionService) { }

  ngOnInit() {
  }

  /**
   * Handles the new Stripe Soure creation
   * @param source A Stripe Source
   */
  handleNewSource(source) {
    console.log(source);
    this.loadingOverlayService.start();
    this.source$ = this.stripeSubscriptionService.subscription(source)
      .pipe(
        finalize(() => this.loadingOverlayService.stop()),
        catchError(e => this.errorHandlerService.handle(e))
      );
  }

}
