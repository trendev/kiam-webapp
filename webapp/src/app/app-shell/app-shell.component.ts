import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent {
  title = `${environment.title}`;
  constructor() { }
}
