import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { environment } from '@env/environment';
import { Component} from '@angular/core';

@Component({
  selector: 'app-administrator-toolbar',
  templateUrl: './administrator-toolbar.component.html',
  styleUrls: ['./administrator-toolbar.component.scss']
})
export class AdministratorToolbarComponent {

  title = `${environment.title}`;

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

    get isLoggedIn(): boolean {
      return this.authenticationService.isLoggedIn;
    }
  
    logout() {
      this.authenticationService.logout().subscribe(
        v => this.router.navigate(['/login']),
        e => this.router.navigate(['/login']));
    }

}
