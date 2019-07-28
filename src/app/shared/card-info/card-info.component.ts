import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnInit,
  Input
} from '@angular/core';
import { AuthenticationService, StripeSetupIntentService } from '@app/core';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { Professional } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';
import { from } from 'rxjs';
import { catchError, take, tap, switchMap } from 'rxjs/operators';
import { stripe, elements } from '@app/app.component';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss']
})
export class CardInfoComponent implements AfterViewInit, OnDestroy, OnInit {

  @Input() isFirst = true;

  @Output() newStripePaymentMethod = new EventEmitter<any>();
  @Output() newStripeSetupIntent = new EventEmitter<any>();

  @ViewChild('cardInfo', { static: true }) private cardInfo: ElementRef;

  private card: any;
  private cardHandler: ({ error }) => void;
  error: string;

  constructor(private cd: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private loadingOverlayService: LoadingOverlayService,
    private errorHandler: ErrorHandlerService,
    private stripeSetupIntentService: StripeSetupIntentService) { }

  ngOnInit() {
    this.cardHandler = ({ error }) => {
      this.error = error ? error.message : undefined;
      this.cd.detectChanges();
    };
  }

  ngAfterViewInit() {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  submit() {
    const pro = new Professional(this.authenticationService.user);

    this.loadingOverlayService.start();
    // switch between creating first payment method and adding a new payment method
    if (this.isFirst) {
      this.createPaymentMethod(pro);
    } else {
      this.handleSetupIntent(pro);
    }
  }

  private createPaymentMethod(pro: Professional) {
    from(stripe.createPaymentMethod('card', this.card,
      {
        billing_details: {
          address: {
            city: pro.address.city,
            country: pro.address.country ? pro.address.country.toLocaleUpperCase().substring(0, 2) : 'FR',
            line1: pro.address.street,
            line2: pro.address.optional,
            postal_code: pro.address.postalCode,
          },
          email: pro.email,
          name: (`${pro.customerDetails.firstName} ${pro.customerDetails.lastName}`).trim(),
          phone: pro.customerDetails.phone
        },
      }
    )).pipe(
      take(1),
      catchError(e => {
        this.loadingOverlayService.stop();
        return this.errorHandler.handle(e, e.message);
      })
    )
      .subscribe(({ paymentMethod, error }) => {
        this.loadingOverlayService.stop();
        if (!!paymentMethod && !error) {
          this.newStripePaymentMethod.emit(paymentMethod);
        }
        if (!!error) { this.cardHandler({ error }); }
      });
  }

  private handleSetupIntent(pro: Professional) {
    this.stripeSetupIntentService.create()
      .pipe(
        take(1),
        tap(seti => console.log(seti)),
        switchMap(seti => from(stripe.handleCardSetup(seti.client_secret,
          this.card,
          {
            payment_method_data: {
              billing_details: {
                address: {
                  city: pro.address.city,
                  country: pro.address.country ? pro.address.country.toLocaleUpperCase().substring(0, 2) : 'FR',
                  line1: pro.address.street,
                  line2: pro.address.optional,
                  postal_code: pro.address.postalCode,
                },
                email: pro.email,
                name: (`${pro.customerDetails.firstName} ${pro.customerDetails.lastName}`).trim(),
                phone: pro.customerDetails.phone
              },
            }
          }
        ))),
        catchError(e => {
          this.loadingOverlayService.stop();
          return this.errorHandler.handle(e, e.message);
        })
      )
      .subscribe(({ setupIntent, error }) => {
        this.loadingOverlayService.stop();
        if (!!setupIntent && !error) {
          this.newStripeSetupIntent.emit(setupIntent);
        }
        if (!!error) { this.cardHandler({ error }); }
      }
      );
  }
}
