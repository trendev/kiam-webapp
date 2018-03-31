import { MatSnackBar } from '@angular/material';
import { Component } from '@angular/core';
import { AuthenticationService } from '@app/core';
import 'rxjs/add/operator/finally';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { ErrorHandlerService } from '@app/error-handler.service';
import { SuccessMessageComponent } from '@app/shared';

@Component({
  selector: 'app-change-professional-password',
  templateUrl: './change-professional-password.component.html',
  styleUrls: ['./change-professional-password.component.scss']
})
export class ChangeProfessionalPasswordComponent {

  constructor(private authenticationService: AuthenticationService,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) { }

  save(password: string) {
    this.loadingOverlayService.start();
    this.authenticationService.newPassword(password)
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
        pwd => {
          this.authenticationService.user.password = pwd;
          this.snackBar.openFromComponent(SuccessMessageComponent, {
            data: `Mot de passe mis à jour`,
            duration: 2000
          });
        },
        e => this.errorHandler.handle(e, `Une erreur est survenue lors de la modification du mot de passe sur le serveur`)
      );
  }

}
