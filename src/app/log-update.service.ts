import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class LogUpdateService {

  constructor(updates: SwUpdate, private snackBar: MatSnackBar) {

    updates.available.subscribe(event => {
      console.log('current version is', event.current.appData['version']);
      console.log('available version is', event.available.appData['version']);

      this.snackBar.open(`version actuelle: ${event.current.hash} `
        + `/ version disponible: ${event.available.hash}`,
        `Mise à jour disponible`,
        { duration: 5000 });
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous.appData['version']);
      console.log('new version is', event.current.appData['version']);

      this.snackBar.open(`ancienne version: ${event.previous.hash} / nouvelle version: ${event.current.hash}`,
        `Mise à jour effectuée`,
        { duration: 5000 });
    });
  }
}
