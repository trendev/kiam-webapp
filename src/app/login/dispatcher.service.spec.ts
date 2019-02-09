import { AuthenticationService, CoreModule } from '@app/core';
import { TestBed, inject } from '@angular/core/testing';

import { DispatcherService } from './dispatcher.service';
import { AppRoutingModule } from '@app/app-routing.module';
import { SharedModule } from '@app/shared';
import { APP_BASE_HREF } from '@angular/common';

describe('DispatcherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        SharedModule,
        AppRoutingModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthenticationService,
        DispatcherService]
    });
  });

  it('should be created', inject([DispatcherService], (service: DispatcherService) => {
    expect(service).toBeTruthy();
  }));
});
