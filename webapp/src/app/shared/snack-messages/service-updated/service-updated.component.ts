import { Component, OnInit, Inject } from '@angular/core';
import { Service } from '@app/entities';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-service-updated',
  templateUrl: './service-updated.component.html',
  styleUrls: ['./service-updated.component.scss']
})
export class ServiceUpdatedComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Service) { }

  ngOnInit() {
  }

}
