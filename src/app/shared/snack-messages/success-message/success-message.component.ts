import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss']
})
export class SuccessMessageComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }
}
