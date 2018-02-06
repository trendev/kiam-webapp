import { Component, OnInit, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';
import { Client } from '@app/entities';

@Component({
  selector: 'app-client-created',
  templateUrl: './client-created.component.html',
  styleUrls: ['./client-created.component.scss']
})
export class ClientCreatedComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Client) { }

  ngOnInit() {
  }

}
