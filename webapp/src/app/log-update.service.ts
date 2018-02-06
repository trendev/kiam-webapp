import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class LogUpdateService {

  constructor(updates: SwUpdate, private snackBar: MatSnackBar) {

    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);

      this.snackBar.open(`version actuelle: ${event.current} / version disponible: ${event.available}`,
        `Mise à jour disponible`,
        { duration: 3000 });
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);

      this.snackBar.open(`ancienne version: ${event.previous} / nouvelle version: ${event.current}`,
        `Mise à jour effectuée`,
        { duration: 3000 });
    });
  }
}
