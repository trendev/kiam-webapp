import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class LogUpdateService {

  constructor(updates: SwUpdate, private snackBar: MatSnackBar) {

    updates.available.subscribe(event => {
      console.log('current version is', event.current.appData['version']);
      console.log('available version is', event.available.appData['version']);

      const snackBarRef = this.snackBar.open(`Mise à jour disponible`,
        `Recharger`,
        { duration: 5000 });

      snackBarRef.onAction().subscribe(() => {
        window.location.reload(); // reload the current page with the new version
      });
    });

    updates.activated.subscribe(event => {
      console.log('old version was', event.previous.appData['version']);
      console.log('new version is', event.current.appData['version']);

      this.snackBar.open(`Mise à jour effectuée ✅`, `OK`);
    });
  }
}
