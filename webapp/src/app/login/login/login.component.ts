import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    const sub = this.authenticationService.login('julien.sie@gmail.com', 'Qsec0fr@3').subscribe();
    // sub.unsubscribe();
  }

}
