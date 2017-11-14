import { TestBed, async, inject } from '@angular/core/testing';

import { LoginGuard } from './login.guard';

import { AuthenticationService, CoreModule } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { SharedModule } from '@app/shared';
import { APP_BASE_HREF } from '@angular/common';
import { DispatcherService } from '@app/login/dispatcher.service';

describe('LoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, AppRoutingModule, SharedModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthenticationService,
        DispatcherService,
        LoginGuard]
    });
  });

  it('should ...', inject([LoginGuard], (guard: LoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
