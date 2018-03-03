import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-collective-group',
  templateUrl: './create-collective-group.component.html',
  styleUrls: ['./create-collective-group.component.scss']
})
export class CreateCollectiveGroupComponent implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
