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
import { AuthenticationService } from '@app/core';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { Professional } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';
import { from, Subscription } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss']
})
export class CardInfoComponent implements AfterViewInit, OnDestroy, OnInit {

  @Input() amount: number;

  @Output() newSource = new EventEmitter<any>();

  @ViewChild('cardInfo') private cardInfo: ElementRef;

  private card: any;
  private cardHandler: ({ error }) => void;
  error: string;

  constructor(private cd: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private loadingOverlayService: LoadingOverlayService,
    private errorHandler: ErrorHandlerService) { }

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

    from(stripe.createSource(this.card,
      {
        amount: this.amount * 100,
        currency: 'EUR',
        owner: {
          address: {
            city: pro.address.city,
            country: pro.address.country,
            line1: pro.address.street,
            postal_code: pro.address.postalCode
          },
          email: pro.email,
          name: `${pro.customerDetails.firstName} ${pro.customerDetails.lastName}`,
          phone: pro.customerDetails.phone
        }
      })).pipe(
        take(1),
        catchError(e => {
          this.loadingOverlayService.stop();
          return this.errorHandler.handle(e, e.message);
        })
      )
      .subscribe(({ source, error }) => {
        this.loadingOverlayService.stop();
        if (!!source && !error) { this.newSource.emit(source); }
      });

  }

}
