import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, ClientBill } from '@app/entities';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {

  client: Client;
  clientBills: ClientBill[];

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data: {
        client: Client,
        clientBills: ClientBill[]
      }) => {
        this.client = data.client;
        this.clientBills = data.clientBills;
      }
    );
  }

}
