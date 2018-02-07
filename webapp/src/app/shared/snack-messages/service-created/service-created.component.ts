import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { Service } from '@app/entities';

@Component({
  selector: 'app-service-created',
  templateUrl: './service-created.component.html',
  styleUrls: ['./service-created.component.scss']
})
export class ServiceCreatedComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Service) { }

  ngOnInit() {
  }

}
