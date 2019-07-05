
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationExtras } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { environment } from '@env/environment';
import { Component } from '@angular/core';
import { LoadingOverlayService } from '@app/loading-overlay.service';

import { SuccessMessageComponent } from '@app/shared';

@Component({
  selector: 'app-professional-toolbar',
  templateUrl: './professional-toolbar.component.html',
  styleUrls: ['./professional-toolbar.component.scss']
})
export class ProfessionalToolbarComponent {

  title = `${environment.title}`;

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  logout() {
    this.authenticationService.logout().pipe(
      finalize(() => {
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `Tu es déconnecté(e) 👍`,
          duration: 2000
        });
        this.router.navigate(['/login'], this.authenticationService.loginRequired);
      }))
      .subscribe();
  }

}
