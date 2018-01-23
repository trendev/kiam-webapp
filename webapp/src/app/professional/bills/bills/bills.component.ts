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
  private bills: Bill[];
  billsModel: BillModel[];

  displayedColumns = [
    'deliveryDate', 'reference', 'name', 'amount', 'paymentDate'];
  datasource: MatTableDataSource<BillModel>;

  @ViewChild(MatSort) sort: MatSort;

  _showFull = true;

  _showUnpaid = false;

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService) {
    this.route.data.subscribe(
      (data: {
        bills: Bill[]
      }) => {
        this.bills = data.bills;
      }
    );
  }

  ngOnInit() {
    this.initBillsModel();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
  }

  initBillsModel() {
    this.billsModel = this.bills.sort(// inverse order : most recent first
      (b1, b2) => {
        const diff = -moment(b1.deliveryDate).diff(moment(b2.deliveryDate));
        return (!diff) ? -moment(b1.issueDate).diff(moment(b2.issueDate)) : diff;
      }
    )
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
        this.bills = bills;
        this.initBillsModel();
        // keep the current view updated
        this.showFull = this._showFull;
        this.showUnpaid = this._showUnpaid;

      },
      // TODO : handle the error
      e => console.error(`Une erreur est survenue lors de la collecte des factures sur le serveur`)
      );
  }

  get unpaid(): number {
    return this.bills.filter(b => !b.paymentDate).length;
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

  gotoClientBill(id: number, ref: string) {
    this.router.navigate(['/professional/bills/clientbill', { id: id, ref: ref }]);
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
    switch (bill.cltype) {
      case BillType.CLIENT_BILL: {
        const clb = bill as ClientBill;
        this.name = `${clb.client.customerDetails.firstName} ${clb.client.customerDetails.lastName}`;
        break;
      }
      case BillType.COLLECTIVE_GROUP_BILL: {
        const cgb = bill as CollectiveGroupBill;
        this.name = `${cgb.collectiveGroup.groupName}`;
        break;
      }
      case BillType.INDIVIDUAL_BILL: {
        const ib = bill as IndividualBill;
        this.name = `${ib.individual.customerDetails.firstName} ${ib.individual.customerDetails.lastName}`;
        break;
      }
      default:
        throw new Error(`${bill.cltype} is not a supported type of Bill`);
    }
  }
}
