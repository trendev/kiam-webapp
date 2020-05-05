import { environment } from './../environments/environment';
import { LogUpdateService } from './log-update.service';
import { LoadingOverlayService } from './loading-overlay.service';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private loadingOverlayService: LoadingOverlayService,
    private logUpdateService: LogUpdateService,
    public router: Router) {
    // google analytics
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd
        && environment.production) {
        gtag('config', 'UA-165570870-1',
          {
            'page_path': event.urlAfterRedirects
          });
      }
    });
  }
}

export const stripe: any = Stripe('pk_test_zw5JuBUOmXxIsi55rTtDDQG9');
export const elements: any = stripe.elements({ locale: 'fr' });
