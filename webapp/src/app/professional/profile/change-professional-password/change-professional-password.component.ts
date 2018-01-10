import { Component } from '@angular/core';
import { AuthenticationService } from '@app/core';
import 'rxjs/add/operator/finally';
import { LoadingOverlayService } from '@app/loading-overlay.service';

@Component({
  selector: 'app-change-professional-password',
  templateUrl: './change-professional-password.component.html',
  styleUrls: ['./change-professional-password.component.scss']
})
export class ChangeProfessionalPasswordComponent {

  constructor(private authenticationService: AuthenticationService,
    private loadingOverlayService: LoadingOverlayService) { }

  save(password: string) {
    this.loadingOverlayService.start();
    this.authenticationService.newPassword(password)
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
      pwd => this.authenticationService.user.password = pwd,
      // TODO : handle the error
      e => console.error(`Une erreur est survenue lors de la modification du mot de passe sur le serveur`)
      );
  }

}
