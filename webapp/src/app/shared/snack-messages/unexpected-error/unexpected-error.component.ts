import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-unexpected-error',
  templateUrl: './unexpected-error.component.html',
  styleUrls: ['./unexpected-error.component.scss']
})
export class UnexpectedErrorComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }

  ngOnInit() {
  }

}
