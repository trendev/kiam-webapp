import { CollectiveGroup } from '@app/entities';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-collective-group-created',
  templateUrl: './collective-group-created.component.html',
  styleUrls: ['./collective-group-created.component.scss']
})
export class CollectiveGroupCreatedComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: CollectiveGroup) { }

  ngOnInit() {
  }

}
