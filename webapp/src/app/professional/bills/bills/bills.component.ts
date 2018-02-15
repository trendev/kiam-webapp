import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Bill, BillType, ClientBill, CollectiveGroupBill, IndividualBill, PaymentMode } from '@app/entities';
import { MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { ProfessionalService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import * as moment from 'moment';
import { BillsRefreshedComponent, BillModel, BillsUtils, comparePaymentModesFn } from '@app/shared';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit, AfterViewInit {
  bills: Bill[] = [];
  paymentModes: PaymentMode[] = [];

  private billsModel: BillModel[] = [];
  private selectedPaymentModes: PaymentMode[] = [];

  displayedColumns = [
    'deliveryDate', 'reference', 'name', 'amount', 'paymentStatus'];
  datasource: MatTableDataSource<BillModel>;

  @ViewChild(MatSort) sort: MatSort;

  _showFull = true;

  _showUnpaid = false;

  _showPending = false;

  minBound: number;
  minDate: number;
  maxBound: number;
  maxDate: number;

  billsPeriodFilterFn = (b: Bill) => true;

  // inverse order : most recent first
  billsSortFn = (b1: Bill, b2: Bill) => {
    const diff = -moment(b1.deliveryDate).diff(moment(b2.deliveryDate));
    return (!diff) ? -moment(b1.issueDate).diff(moment(b2.issueDate)) : diff;
  }

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar) {
    this.route.data.subscribe(
      (data: {
        bills: Bill[],
        paymentModes: PaymentMode[]
      }) => {
        this.bills = data.bills.sort(this.billsSortFn);
        this.paymentModes = data.paymentModes.sort(comparePaymentModesFn);
        this.initDates();
        this.initBillsPeriodFilterFn();
        this.selectedPaymentModes = this.paymentModes.slice();
      }
    );
  }

  ngOnInit() {
    this.setBillsModel();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
  }

  initAll() {
    this.initDates();
    this.initBillsPeriodFilterFn();
    this.setBillsModel();
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

  setBillsModel() {
    this.billsModel = this.bills
      .filter(this.billsPeriodFilterFn)
      .map(b => new BillModel(b));

    this.datasource =
      new MatTableDataSource<BillModel>(this.billsModel);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  refreshBills() {
    this.loadingOverlayService.start();
    this.professionalService.getBills()
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
        bills => {
          this.bills = bills.sort(this.billsSortFn);
          this.initAll();
          // keep the current view updated
          this.showFull = this._showFull;
          this.showUnpaid = this._showUnpaid;
          this.showPending = this._showPending;
          this.snackBar.openFromComponent(BillsRefreshedComponent, { duration: 2000 });
        },
        // TODO : handle the error
        e => console.error(`Une erreur est survenue lors de la collecte des factures sur le serveur`)
      );
  }

  get total(): number {
    return this.billsModel.length;
  }

  get unpaid(): BillModel[] {
    return this.billsModel.filter(b => BillsUtils.isUnPaid(b.bill));
  }

  get pending(): BillModel[] {
    return this.billsModel.filter(b => BillsUtils.isPending(b.bill));
  }

  get selectionRevenue(): number {
    return this.billsModel
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
      this.datasource.data = this.billsModel;
    }
  }

  set showUnpaid(value: boolean) {
    this._showUnpaid = value;
    if (this._showUnpaid) {
      this._showFull = this._showPending = !this._showUnpaid;
      this.datasource.data = this.unpaid;
    }
  }

  set showPending(value: boolean) {
    this._showPending = value;
    if (this._showPending) {
      this._showFull = this._showUnpaid = !this._showPending;
      this.datasource.data = this.pending;
    }
  }

  billsModelIsEmpty(): boolean {
    return this.billsModel.length === 0;
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

  shrinkRef(ref: string) {
    return ref.replace(/^PRO\-[\d\w]+\-(.+)$/, '$1');
  }

  updateMinDate(minDate: number) {
    if (this.minDate !== minDate) {
      console.log(`==> ` + minDate);
      this.minDate = minDate;
      this.initBillsPeriodFilterFn();
      this.setBillsModel();
    }
  }

  updateMaxDate(maxDate: number) {
    if (this.maxDate !== maxDate) {
      this.maxDate = maxDate;
      this.initBillsPeriodFilterFn();
      this.setBillsModel();
    }
  }

}
