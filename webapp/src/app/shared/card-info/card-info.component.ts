import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss']
})
export class CardInfoComponent implements OnInit {

  @Output() newSource = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}
