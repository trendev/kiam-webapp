import { LogUpdateService } from './log-update.service';
import { LoadingOverlayService } from './loading-overlay.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private loadingOverlayService: LoadingOverlayService,
    private logUpdateService: LogUpdateService) {
  }
}

export const stripe: any = Stripe('pk_test_zw5JuBUOmXxIsi55rTtDDQG9');
export const elements: any = stripe.elements({ locale: 'fr' });
