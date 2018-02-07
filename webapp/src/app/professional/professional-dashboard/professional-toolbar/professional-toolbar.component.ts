import { LogoutComponent } from '@app/shared';
import { MatSnackBar } from '@angular/material';
import { Router, NavigationExtras } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { environment } from '@env/environment';
import { Component } from '@angular/core';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-professional-toolbar',
  templateUrl: './professional-toolbar.component.html',
  styleUrls: ['./professional-toolbar.component.scss']
})
export class ProfessionalToolbarComponent {

  title = `${environment.title}`;

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar) { }

  logout() {
    this.loadingOverlayService.start();
    this.authenticationService.logout()
      .finally(() => {
        this.loadingOverlayService.stop();
        this.snackBar.openFromComponent(LogoutComponent, { duration: 2000 });
        this.router.navigate(['/login'], this.authenticationService.loginRequired);
      })
      .subscribe(); // TODO : handle success and failure
  }

}
