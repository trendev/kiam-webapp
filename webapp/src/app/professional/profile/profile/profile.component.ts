import { AuthenticationService } from '@app/core';
import { Component, OnInit } from '@angular/core';
import { Professional } from '@app/entities';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  pro: Professional;

  constructor(private authenticationService: AuthenticationService) {
    this.pro = new Professional(this.authenticationService.user);
  }

  ngOnInit() {
  }

  save() {
    console.log('save requested...');
    // TODO : implements
  }
}
