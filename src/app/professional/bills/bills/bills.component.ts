
import { finalize } from 'rxjs/operators';
import { ErrorHandlerService } from '@app/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { Bill, ClientBill, CollectiveGroupBill, IndividualBill, PaymentMode } from '@app/entities';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfessionalService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;
import { BillModel, BillsUtils, comparePaymentModesFn, VatAmount, SuccessMessageComponent } from '@app/shared';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit {
  bills: Bill[] = [];
  paymentModes: PaymentMode[] = [];

  private _billsModel: BillModel[] = [];
  private _selectedPaymentModes: PaymentMode[] = [];

  data: BillModel[];

  _showFull = true;

  _showUnpaid = false;

  _showPending = false;

  minBound: number;
  minDate: number;
  maxBound: number;
  maxDate: number;

  private _vatAmounts: VatAmount[];

  billsPeriodFilterFn = (b: Bill) => true;

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) {

    this.route.data.subscribe(
      (data: {
        bills: Bill[]
      }) => {
        this.bills = data.bills.sort(BillsUtils.sortBillsFn);
        this.initAll();
      }
    );
  }

  ngOnInit() {
  }

  initPaymentModes() {
    this.paymentModes = Array.from(new Set( // use a set to remove duplicated payment mode
      this._billsModel.map(bm => bm.bill)
        .filter(b => !!b.paymentDate && !!b.payments) // get payment modes from closed & payed bills only
        .map(b => b.payments.map(p => p.paymentMode.name)) // convert bills stream into a stream of names of payment modes
        .reduce((a, b) => [...a, ...b], [])
    ))
      .map(name => new PaymentMode({ name: name })) // rebuild a new payment mode array from the deduplicated names
      .sort(comparePaymentModesFn); // order by name

    this._selectedPaymentModes = [];
  }

  initAll() {
    this.initDates();
    this.initBillsPeriodFilterFn();
    this.setBillsModel();
    this.initPaymentModes();
  }

  initDates() {
    const size = this.bills.length;
    if (size > 0) {
      this.minDate = this.minBound = this.bills[size - 1].deliveryDate; // the last one is the oldest one
      this.maxDate = this.maxBound = this.bills[0].deliveryDate; // the first one is the most recent one
    }
  }

  initBillsPeriodFilterFn() {
    if (this.bills.length > 0) {
      this.billsPeriodFilterFn = (b: Bill) => (
        (moment(b.deliveryDate).isSameOrAfter(moment(this.minDate))
          && moment(b.deliveryDate).isSameOrBefore(moment(this.maxDate)))
        || (!!b.paymentDate
          && moment(b.paymentDate).isSameOrAfter(moment(this.minDate))
          && moment(b.paymentDate).isSameOrBefore(moment(this.maxDate))
        )
      );
    }
  }

  setBillsModel(pmFilter: (Bill) => boolean = (b) => true) {
    this._billsModel = this.bills
      .filter(this.billsPeriodFilterFn)
      .filter(pmFilter)
      .map(b => new BillModel(b));
    this.data = this._billsModel;
    this.initVATAmounts();
  }

  refreshBills() {
    this.loadingOverlayService.start();
    this.professionalService.getBills().pipe(
      finalize(() => this.loadingOverlayService.stop())
    ).subscribe(
      bills => {
        this.bills = bills.sort(BillsUtils.sortBillsFn);
        this.initAll();
        // keep the current view updated
        this.showFull = this._showFull;
        this.showUnpaid = this._showUnpaid;
        this.showPending = this._showPending;
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `Facturier rafraîchi`,
          duration: 2000
        });
      },
      e => this.errorHandler.handle(e, 'Une erreur est survenue lors de la collecte des factures depuis le serveur'));
  }

  get total(): number {
    return this._billsModel.length;
  }

  get unpaid(): BillModel[] {
    return this._billsModel.filter(b => BillsUtils.isUnPaid(b.bill));
  }

  get pending(): BillModel[] {
    return this._billsModel.filter(b => BillsUtils.isPending(b.bill));
  }

  get selectionRevenue(): number {
    return this._billsModel
      .filter(bm => !!bm.paymentDate
        && moment(bm.paymentDate).isSameOrBefore(moment(this.maxDate)))
      .map(bm => bm.amount)
      .reduce((a, b) => a + b, 0);
  }

  get unpaidRevenue(): number {
    return this.unpaid.map(b => b.amount)
      .reduce((a, b) => a + b, 0);
  }

  get pendingRevenue(): number {
    return this.pending.map(b => b.amount)
      .reduce((a, b) => a + b, 0);
  }

  get showFull(): boolean {
    return this._showFull && !this.billsModelIsEmpty();
  }

  get showUnpaid(): boolean {
    return this._showUnpaid && !this.billsModelIsEmpty();
  }

  get showPending(): boolean {
    return this._showPending && !this.billsModelIsEmpty();
  }

  set showFull(value: boolean) {
    this._showFull = value;
    if (this._showFull) {
      this._showUnpaid = this._showPending = !this._showFull;
      this.data = this._billsModel;
    }
  }

  set showUnpaid(value: boolean) {
    this._showUnpaid = value;
    if (this._showUnpaid) {
      this._showFull = this._showPending = !this._showUnpaid;
      this.data = this.unpaid;
    }
  }

  set showPending(value: boolean) {
    this._showPending = value;
    if (this._showPending) {
      this._showFull = this._showUnpaid = !this._showPending;
      this.data = this.pending;
    }
  }

  billsModelIsEmpty(): boolean {
    return this._billsModel.length === 0;
  }

  isEmpty(): boolean {
    return this.bills.length === 0;
  }

  gotoBill(ref: string) {
    const bill = this.bills.filter(b => b.reference === ref).pop();
    if (bill) {
      BillsUtils.visitBill(bill, {
        clientbill: () => {
          const clb = bill as ClientBill;
          this.router.navigate(['/professional/bills/clientbill', { id: clb.client.id, ref: ref }]);
        },
        collectivegroupbill: () => {
          const cgb = bill as CollectiveGroupBill;
          this.router.navigate(['/professional/bills/collectivegroupbill', { id: cgb.collectiveGroup.id, ref: ref }]);
        },
        individualbill: () => {
          const ib = bill as IndividualBill;
          this.router.navigate(['/professional/bills/individualbill', { email: ib.individual.email, ref: ref }]);
        },
      });
    } else {
      console.warn(`Bill ${ref} cannot be found !`);
    }
  }



  updateMinDate(minDate: number) {
    if (this.minDate !== minDate) {
      this.minDate = minDate;
      this.initBillsPeriodFilterFn();
      this.setBillsModel();
      this.initPaymentModes();
    }
  }

  updateMaxDate(maxDate: number) {
    if (this.maxDate !== maxDate) {
      this.maxDate = maxDate;
      this.initBillsPeriodFilterFn();
      this.setBillsModel();
      this.initPaymentModes();
    }
  }

  updatePaymentModeSelection(pms: PaymentMode[]) {
    this._selectedPaymentModes = pms.slice();

    this.setBillsModel((bill: Bill) => {

      if (!!bill.paymentDate) {
        return bill.payments ?
          (bill.payments.map(p => p.paymentMode)
            .findIndex(pm =>
              this._selectedPaymentModes.findIndex(_pm => _pm.name === pm.name) !== -1)
            !== -1)
          : false; // can be a bill with an amount <= 0
      } else {
        return false;
      }
    });
  }


  private initVATAmounts() {
    this._vatAmounts = BillsUtils.reduceVATAmounts(this._billsModel.filter(bm => bm.paymentDate).map(bm => bm.bill));
  }

  get vatAmounts(): VatAmount[] {
    return this._vatAmounts;
  }

  getTaxBase(va: VatAmount): number {
    return BillsUtils.getTaxBase(va);
  }

}
