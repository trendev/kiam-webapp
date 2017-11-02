import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit {

  readonly admin_url = `${environment.base_url}/admin/index.xhtml`;

  constructor() { }

  ngOnInit() {
  }

}
