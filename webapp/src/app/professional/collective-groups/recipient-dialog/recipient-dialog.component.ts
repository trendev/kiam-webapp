import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-recipient-dialog',
  templateUrl: './recipient-dialog.component.html',
  styleUrls: ['./recipient-dialog.component.scss']
})
export class RecipientDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RecipientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
