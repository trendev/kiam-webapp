import { Administrator } from '@app/entities';
import { AuthenticationService } from '@app/core';
import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit {

  readonly adminUrl = `${environment.base_url}/admin/index.xhtml`;

  admin: Administrator;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.admin = new Administrator(this.authenticationService.user);
  }

}
