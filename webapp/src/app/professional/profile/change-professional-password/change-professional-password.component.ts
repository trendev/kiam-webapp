import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';

@Component({
  selector: 'app-change-professional-password',
  templateUrl: './change-professional-password.component.html',
  styleUrls: ['./change-professional-password.component.scss']
})
export class ChangeProfessionalPasswordComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  save(password: string) {
    this.authenticationService.newPassword(password).subscribe(
      pwd => this.authenticationService.user.password = pwd,
      // TODO : handle the error
      e => console.error(`Une erreur est survenue lors de la modification du mot de passe sur le serveur`)
    );
  }

}
