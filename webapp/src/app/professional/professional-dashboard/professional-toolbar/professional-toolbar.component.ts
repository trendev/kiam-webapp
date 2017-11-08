import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { environment } from '@env/environment';
import { Component } from '@angular/core';

@Component({
  selector: 'app-professional-toolbar',
  templateUrl: './professional-toolbar.component.html',
  styleUrls: ['./professional-toolbar.component.scss']
})
export class ProfessionalToolbarComponent {

  title = `${environment.title}`;

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  logout() {
    this.authenticationService.logout().subscribe(
      v => this.router.navigate(['/login']),
      e => this.router.navigate(['/login']));
  }

}
