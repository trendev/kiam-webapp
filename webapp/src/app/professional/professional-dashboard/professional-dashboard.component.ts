import { AuthenticationService } from '@app/core/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-professional-dashboard',
  templateUrl: './professional-dashboard.component.html',
  styleUrls: ['./professional-dashboard.component.scss']
})
export class ProfessionalDashboardComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.logout();
  }

}
