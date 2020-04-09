import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, DoCheck } from '@angular/core';
import { PaymentMode, Bill, Payment } from '@app/entities';
import { FormGroup, Validators, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { CustomValidators, ErrorAggregatorDirective, Utils } from '@app/shared';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss']
})
export class BillDetailComponent implements OnInit, DoCheck {
  @Input() paymentModes: PaymentMode[];
  @Input() bill: Bill;
  @Output() cancel = new EventEmitter<any>();
  @Output() save = new EventEmitter<Bill>();
  @Output() export = new EventEmitter<any>();

  private _amount: number;

  form: FormGroup;

  private commentsValidators = [
    Validators.required,
    CustomValidators.blankStringForbidden,
    Validators.maxLength(200)
  ];

  @ViewChild(ErrorAggregatorDirective, { static: true }) errorAggregator: ErrorAggregatorDirective;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._amount = this.bill.amount;

    this.form = this.createForm();

    this.form.valueChanges.forEach(_ => {
      if (this.form.invalid && this.errorAggregator) {
        this.errorAggregator.viewContainerRef.clear();
      }
    });
  }

  public ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  get amount(): number {
    return this._amount;
  }

  get paymentsContent(): AbstractControl {
    return this.form.get('payments').get('content');
  }

  isClosedBill() {
    return this.bill.paymentDate ? true : false;
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      information: this.fb.group({
        amount: new FormControl({ value: this._amount / 100, disabled: true }),
        discount: new FormControl({ value: this.bill.discount / 100, disabled: true }),
        dates: this.fb.group({
          deliveryDate: new FormControl({ value: moment(this.bill.deliveryDate), disabled: true }),
          paymentDate: new FormControl({
            value: this.isClosedBill() ? moment(this.bill.paymentDate) : undefined,
            disabled: true
          })
        }, { validator: CustomValidators.validDeliveryPaymentDates }),
        closeable: new FormControl({
          value: this.isClosedBill(),
          disabled: this.isClosedBill()
        }),
        comments: this.fb.array(this.bill.comments || [],
          CustomValidators.validComments(this.commentsValidators))
      }),
      purchasedOfferings: this.fb.group({
        content: new FormControl(this.bill.purchasedOfferings)
      }),
      payments: this.fb.group({
        content: new FormControl(this.initPayments(), [
          CustomValidators.validPayments(this._amount)])
      })
    });
    return fg;
  }

  private initPayments(): Payment[] {
    if (!this.bill.payments) {
      return [];
    } else {
      return this.bill.payments.map(pm => new Payment({
        amount: pm.amount / 100,
        paymentMode: pm.paymentMode
      }));
    }
  }

  isCloseable(): boolean {
    return this._amount <= 0
      ? this.form.get('information').get('dates').get('paymentDate').value
      : ((Math.round(Utils.totalPayments(this.paymentsContent.value) * 100) === this._amount)
        && this.form.get('information').get('dates').get('paymentDate').value);
  }

  isValid(): boolean {
    return !(this.form.pristine || this.form.invalid)
      && Utils.hasValidPaymentState(this.form);
  }

  revert() {
    this.form.reset(this.createForm().getRawValue());

    // rebuilds the controls of the comments group if they have been modified/removed
    const information = this.form.get('information') as FormGroup;
    information.setControl('comments', this.fb.array(this.bill.comments || [], CustomValidators.validComments(this.commentsValidators)));
  }

  cancelBillCreation() {
    this.cancel.emit();
  }

  saveBill() {
    const bill = this.prepareSave();
    this.save.emit(bill);
  }

  prepareSave(): Bill {
    const value = this.form.getRawValue();

    return new Bill({
      reference: this.bill.reference,
      amount: this.bill.amount,
      discount: this.bill.discount,
      deliveryDate: value.information.dates.deliveryDate.valueOf(),
      paymentDate: value.information.dates.paymentDate ? value.information.dates.paymentDate.valueOf() : undefined,
      comments: value.information.comments || undefined,
      purchasedOfferings: value.purchasedOfferings.content,
      payments: value.payments.content.map(pm => new Payment({
        amount: Math.round(pm.amount * 100),
        paymentMode: pm.paymentMode
      }))
    });
  }

  exportBill() {
    this.export.emit();
  }

}
