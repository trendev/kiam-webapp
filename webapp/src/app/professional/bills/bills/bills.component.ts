import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Bill, BillType, ClientBill, CollectiveGroupBill, IndividualBill } from '@app/entities';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ProfessionalService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import * as moment from 'moment';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit, AfterViewInit {
  bills: Bill[] = [];
  private billsModel: BillModel[];

  displayedColumns = [
    'deliveryDate', 'reference', 'name', 'amount', 'paymentDate'];
  datasource: MatTableDataSource<BillModel>;

  @ViewChild(MatSort) sort: MatSort;

  _showFull = true;

  _showUnpaid = false;

  unpaidRevenue = 0;

  minDate: number;
  maxDate: number;

  billsFilterFn = (b: Bill) => true;

  // inverse order : most recent first
  billsSortFn = (b1: Bill, b2: Bill) => {
    const diff = -moment(b1.deliveryDate).diff(moment(b2.deliveryDate));
    return (!diff) ? -moment(b1.issueDate).diff(moment(b2.issueDate)) : diff;
  }

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService) {
    this.route.data.subscribe(
      (data: {
        bills: Bill[]
      }) => {
        this.bills = data.bills.sort(this.billsSortFn);
        this.initDates();
        this.initBillsFilterFn();
      }
    );
  }

  ngOnInit() {
    this.initRevenues();
    this.initBillsModel();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
  }

  initAll() {
    this.initDates();
    this.initBillsFilterFn();
    this.initRevenues();
    this.initBillsModel();
  }

  initDates() {
    const size = this.bills.length;
    if (size > 0) {
      this.minDate = this.bills[size - 1].deliveryDate; // the last one is the oldest one
      this.maxDate = this.bills[0].deliveryDate; // the first one is the most recent one
    }
  }

  initBillsFilterFn() {
    if (this.bills.length > 0) {
      this.billsFilterFn = (b: Bill) => moment(b.deliveryDate).isSameOrAfter(moment(this.minDate))
        && moment(b.deliveryDate).isSameOrBefore(moment(this.maxDate));
    }
  }

  initBillsModel() {
    this.billsModel = this.bills.filter(this.billsFilterFn).map(b => new BillModel(b));

    this.datasource =
      new MatTableDataSource<BillModel>(this.billsModel);
  }

  initRevenues() {
    this.unpaidRevenue = this.bills
      .filter(b => !b.paymentDate)
      .map(b => b.amount)
      .reduce((a, b) => a + b, 0);
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

      },
      // TODO : handle the error
      e => console.error(`Une erreur est survenue lors de la collecte des factures sur le serveur`)
      );
  }

  get total(): number {
    return this.bills.length;
  }

  get unpaid(): number {
    return this.bills.filter(b => !b.paymentDate).length;
  }

  get selectionRevenue(): number {
    return this.billsModel
      .filter(bm => !!bm.paymentDate)
      .map(bm => bm.amount)
      .reduce((a, b) => a + b, 0);
  }

  get showFull(): boolean {
    return this._showFull && !this.billsIsEmpty();
  }

  get showUnpaid(): boolean {
    return this._showUnpaid && !this.billsIsEmpty();
  }

  set showFull(value: boolean) {
    this._showFull = value;
    if (this._showFull) {
      this._showUnpaid = !this._showFull;
      this.datasource.data = this.billsModel;
    }
  }

  set showUnpaid(value: boolean) {
    this._showUnpaid = value;
    if (this._showUnpaid) {
      this._showFull = !this._showUnpaid;
      this.datasource.data = this.billsModel.filter(b => !b.paymentDate);
    }
  }

  billsIsEmpty(): boolean {
    return this.bills.length === 0;
  }

  gotoBill(ref: string) {
    const bill = this.bills.filter(b => b.reference === ref).pop();
    if (bill) {
      visitBill(bill, {
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

}

class BillModel {
  reference: string;
  deliveryDate: number;
  cltype: string;
  amount: number;
  currency: string;
  paymentDate: boolean;
  name: string;

  constructor(bill: Bill) {
    this.reference = bill.reference;
    this.deliveryDate = bill.deliveryDate;
    this.cltype = bill.cltype;
    this.amount = bill.amount;
    this.currency = bill.currency;
    this.paymentDate = !!bill.paymentDate;
    visitBill(bill,
      {
        clientbill: () => {
          const clb = bill as ClientBill;
          this.name = `${clb.client.customerDetails.firstName} ${clb.client.customerDetails.lastName}`;
        },
        collectivegroupbill: () => {
          const cgb = bill as CollectiveGroupBill;
          this.name = `${cgb.collectiveGroup.groupName}`;
        },
        individualbill: () => {
          const ib = bill as IndividualBill;
          this.name = `${ib.individual.customerDetails.firstName} ${ib.individual.customerDetails.lastName}`;
        },
      }
    );
  }
}

function visitBill(bill: Bill, fcts: { [key: string]: () => void }) {
  switch (bill.cltype) {
    case BillType.CLIENT_BILL: {
      fcts[BillType.CLIENT_BILL]();
      break;
    }
    case BillType.COLLECTIVE_GROUP_BILL: {
      fcts[BillType.COLLECTIVE_GROUP_BILL]();
      break;
    }
    case BillType.INDIVIDUAL_BILL: {
      fcts[BillType.INDIVIDUAL_BILL]();
      break;
    }
    default:
      throw new Error(`${bill.cltype} is not a supported type of Bill`);
  }
}
