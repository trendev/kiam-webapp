import { AuthenticationService } from '@app/core';
import { Component, OnInit } from '@angular/core';
import { UserAccountType } from '@app/entities';

@Component({
  selector: 'app-unsupported-user-type',
  templateUrl: './unsupported-user-type.component.html',
  styleUrls: ['./unsupported-user-type.component.scss']
})
export class UnsupportedUserTypeComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    if (this.authenticationService.user) {
      console.error(`You are not authenticated with a supported UserAccount: ${this.authenticationService.user.cltype}` +
        ` should be ${UserAccountType.PROFESSIONAL} or ${UserAccountType.INDIVIDUAL} or ${UserAccountType.ADMINISTRATOR}`);
    }

  }

}
