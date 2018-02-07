import { Component, OnInit, Inject } from '@angular/core';
import { Pack } from '@app/entities';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-pack-updated',
  templateUrl: './pack-updated.component.html',
  styleUrls: ['./pack-updated.component.scss']
})
export class PackUpdatedComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Pack) { }

  ngOnInit() {
  }

}
