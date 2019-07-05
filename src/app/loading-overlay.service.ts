import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { Injectable, Inject } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

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

  constructor(private overlay: Overlay,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      router.events.subscribe((routerEvent: Event) => {
        this.checkRouterEvent(routerEvent);
      });
    }
  }

  // prevent handling the loading overlay if the URL is the login page
  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      if (!routerEvent.url.startsWith('/login')) {
        this.start();
      }
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      if (!routerEvent.url.startsWith('/login')) {
        this.stop();
      }
    }
  }


  start(config: LoadingConfig = {}) {
    if (!this.overlayRef) {
      const dialogConfig = { ...DEFAULT_CONFIG, ...config };
      this.overlayRef = this.createOverlay(dialogConfig);
      const filePreviewPortal = new ComponentPortal(LoadingOverlayComponent);

      this.overlayRef.attach(filePreviewPortal);
    }
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
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

}


