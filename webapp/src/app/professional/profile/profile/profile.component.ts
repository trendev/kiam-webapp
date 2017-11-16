import { AuthenticationService } from '@app/core';
import { Component, OnInit } from '@angular/core';
import { Professional } from '@app/entities';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  pro: Professional;
  form: FormGroup;

  constructor(private authenticationService: AuthenticationService) {
    this.pro = new Professional(this.authenticationService.user);
    this.form = new FormGroup({});
  }

  ngOnInit() {
  }

  save() {
    console.log('save requested...');
    // TODO : implements
  }
}
