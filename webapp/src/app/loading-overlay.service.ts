import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { Injectable } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

interface LoadingConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: LoadingConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop'
};

@Injectable()
export class LoadingOverlayService {

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay, private router: Router) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.start();
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.stop();
    }
  }


  start(config: LoadingConfig = {}) {
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    this.overlayRef = this.createOverlay(dialogConfig);
    const filePreviewPortal = new ComponentPortal(LoadingOverlayComponent);

    this.overlayRef.attach(filePreviewPortal);
  }

  private createOverlay(config: LoadingConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: LoadingConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

  stop() {
    this.overlayRef.dispose();
  }

}


