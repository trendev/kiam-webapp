import { Component, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rescission-confirmation-dialog',
  templateUrl: './rescission-confirmation-dialog.component.html',
  styleUrls: ['./rescission-confirmation-dialog.component.scss']
})
export class RescissionConfirmationDialogComponent {

  title = `${environment.title}`;

  constructor(public dialogRef: MatDialogRef<RescissionConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


}
