import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-professional-dashboard',
  templateUrl: './professional-dashboard.component.html',
  styleUrls: ['./professional-dashboard.component.scss']
})
export class ProfessionalDashboardComponent implements OnInit {

  title = 'Comptandye';

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
  }

  get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }

  logout() {
    this.authenticationService.logout()
      .subscribe(
      user => this.router.navigate(['/login']),
      err => this.router.navigate(['/login'])
      );
  }

}
