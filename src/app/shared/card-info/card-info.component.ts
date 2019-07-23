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
import { from } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss']
})
export class CardInfoComponent implements AfterViewInit, OnDestroy, OnInit {

  @Input() amount: number;

  @Output() newToken = new EventEmitter<any>();

  @ViewChild('cardInfo', { static: true }) private cardInfo: ElementRef;

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

    from(stripe.createToken(this.card,
      {
        currency: 'EUR',
        address_city: pro.address.city,
        address_country: pro.address.country,
        address_line1: pro.address.street,
        address_zip: pro.address.postalCode,
        email: pro.email,
        name: (`${pro.customerDetails.firstName} ${pro.customerDetails.lastName}`).trim(),
      })).pipe(
        take(1),
        catchError(e => {
          this.loadingOverlayService.stop();
          return this.errorHandler.handle(e, e.message);
        })
      )
      .subscribe(({ token: token, error }) => {
        this.loadingOverlayService.stop();
        if (!!token && !error) { this.newToken.emit(token); }
        if (!!error) { this.cardHandler({ error }); }
      });

  }

}
