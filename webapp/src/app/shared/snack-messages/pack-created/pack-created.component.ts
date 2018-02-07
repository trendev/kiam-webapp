import { Component, OnInit, Inject } from '@angular/core';
import { Pack } from '@app/entities';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-pack-created',
  templateUrl: './pack-created.component.html',
  styleUrls: ['./pack-created.component.scss']
})
export class PackCreatedComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Pack) { }

  ngOnInit() {
  }

}
