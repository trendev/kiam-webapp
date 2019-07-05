
import {finalize} from 'rxjs/operators';
import { RecipientDialogComponent } from './../recipient-dialog/recipient-dialog.component';
import { CollectiveGroup, CollectiveGroupBill } from '@app/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  ErrorAggregatorDirective,
  CustomValidators,
  BillModel,
  BillsUtils,
  SuccessMessageComponent
} from '@app/shared';
import { CollectiveGroupService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorHandlerService } from '@app/error-handler.service';

@Component({
  selector: 'app-collective-group-detail',
  templateUrl: './collective-group-detail.component.html',
  styleUrls: ['./collective-group-detail.component.scss']
})
export class CollectiveGroupDetailComponent implements OnInit {

  collectiveGroup: CollectiveGroup;
  collectiveGroupBills: CollectiveGroupBill[];

  form: FormGroup;

  @ViewChild(ErrorAggregatorDirective, { static: true }) errorAggregator: ErrorAggregatorDirective;

  constructor(private fb: FormBuilder,
    private collectiveGroupService: CollectiveGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService,
    public dialog: MatDialog) {
    this.route.data.subscribe(
      (data: {
        collectiveGroup: CollectiveGroup;
        collectiveGroupBills: CollectiveGroupBill[];
      }) => {
        this.collectiveGroup = data.collectiveGroup;
        this.collectiveGroupBills = data.collectiveGroupBills;
        this.form = this.createForm();
      });
  }

  ngOnInit() {
    this.form.valueChanges.forEach(_ => {
      if (this.form.invalid && this.errorAggregator) {
        this.errorAggregator.viewContainerRef.clear();
      }
    });
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      groupName: new FormControl(this.collectiveGroup.groupName, [
        Validators.required,
        CustomValidators.blankStringForbidden,
        Validators.maxLength(50)
      ]),
      phone: new FormControl(this.collectiveGroup.phone, [
        Validators.required,
        CustomValidators.phoneNumber
      ]
      ),
      address: this.fb.group({
        street: new FormControl(this.collectiveGroup.address.street, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(100)
        ]),
        optional: new FormControl(this.collectiveGroup.address.optional, [
          CustomValidators.blankStringForbidden,
          Validators.maxLength(100)
        ]),
        postalCode: new FormControl(this.collectiveGroup.address.postalCode, [
          Validators.required,
          CustomValidators.whiteSpaceForbidden,
          Validators.maxLength(5),
          Validators.minLength(5)
        ]),
        city: new FormControl(this.collectiveGroup.address.city, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(75)
        ]),
        country: new FormControl({ value: this.collectiveGroup.address.country, disabled: true })
      }),
    });

    return fg;
  }

  revert() {
    // resets the form field based on the raw value, value alone will ignore disabled field (uuid,registrationDate...)
    this.form.reset(this.createForm().getRawValue());

  }

  prepareSave(): CollectiveGroup {
    const value = this.form.getRawValue();

    const cg = new CollectiveGroup({
      id: this.collectiveGroup.id,
      groupName: value.groupName || undefined,
      phone: value.phone || undefined,
      address: {
        street: value.address.street || undefined,
        optional: value.address.optional || undefined,
        postalCode: value.address.postalCode || undefined,
        city: value.address.city || undefined,
        country: value.address.country || undefined
      }
    });

    return cg;
  }

  save() {
    const cg = this.prepareSave();
    this.loadingOverlayService.start();
    this.collectiveGroupService.update(cg).subscribe(
      _cg => {
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `Groupe ${_cg.groupName} mis à jour`,
          duration: 2000
        });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Impossible de sauvegarder les modifications du Groupe sur le serveur');
      });
  }

  gotoBill(bill: BillModel) {
    this.router.navigate(['/professional/bills/collectivegroupbill', { id: this.collectiveGroup.id, ref: bill.reference }]);
  }

  createNewBill() {

    const dialogRef = this.dialog.open(RecipientDialogComponent, {
      disableClose: false // if true backdrop click or ESC won't close
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) { // result = empty string if user click OK / undefined otherwise
        const id = this.collectiveGroup.id;
        const name = this.collectiveGroup.groupName;
        const rpt = result;
        this.router.navigate(['/professional/bills/create-collectivegroupbill', { id: id, name: name, rpt: rpt }]);
      }
    });

  }

  refreshBills() {
    this.loadingOverlayService.start();
    this.collectiveGroupService.getCollectiveGroupBills(this.collectiveGroup.id).pipe(
      finalize(() => this.loadingOverlayService.stop()))
      .subscribe(
        bills => {
          this.collectiveGroupBills = bills.sort(BillsUtils.sortBillsFn);
          this.snackBar.openFromComponent(SuccessMessageComponent, {
            data: `Micro-facturier rafraîchi`, duration: 2000
          });
        },
        e => this.errorHandler.handle(e, 'Une erreur est survenue lors de la collecte des factures depuis le serveur'));
  }

}
