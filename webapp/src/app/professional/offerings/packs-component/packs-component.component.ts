import { Component, OnInit, Input } from '@angular/core';
import { Pack } from '@app/entities';

@Component({
  selector: 'app-packs-component',
  templateUrl: './packs-component.component.html',
  styleUrls: ['./packs-component.component.scss']
})
export class PacksComponentComponent implements OnInit {

  @Input() offerings: Pack[];

  constructor() { }

  ngOnInit() {
  }

}
