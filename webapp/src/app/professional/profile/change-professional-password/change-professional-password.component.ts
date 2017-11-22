import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-professional-password',
  templateUrl: './change-professional-password.component.html',
  styleUrls: ['./change-professional-password.component.scss']
})
export class ChangeProfessionalPasswordComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  save(password: string) {
    // TODO : use authenticationService#newPassword()
    console.warn(`cool now we can save the password ${password}`);
  }

}
