import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {

  title = `${environment.title}`;

  constructor() { }

  ngOnInit() {
  }

}
