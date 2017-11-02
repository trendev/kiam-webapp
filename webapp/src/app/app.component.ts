import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Comptandye';

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

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
