import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '@app/shared';

@Component({
  selector: 'app-recipient-dialog',
  templateUrl: './recipient-dialog.component.html',
  styleUrls: ['./recipient-dialog.component.scss']
})
export class RecipientDialogComponent implements OnInit {

  recipient: FormControl;

  constructor(public dialogRef: MatDialogRef<RecipientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.recipient = new FormControl('', [
      CustomValidators.blankStringForbidden,
      Validators.maxLength(50)
    ]);
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

}
