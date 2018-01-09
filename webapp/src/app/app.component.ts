import { LoadingOverlayService } from './loading-overlay.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private loadingOverlayService: LoadingOverlayService) {
  }
}
