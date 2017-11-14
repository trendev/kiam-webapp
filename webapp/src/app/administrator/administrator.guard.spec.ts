import { TestBed, async, inject } from '@angular/core/testing';

import { AdministratorGuard } from './administrator.guard';
import { AuthenticationService, CoreModule } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { SharedModule } from '@app/shared';
import { APP_BASE_HREF } from '@angular/common';

describe('AdministratorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, AppRoutingModule, SharedModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AdministratorGuard,
        AuthenticationService]
    });
  });

  it('should ...', inject([AdministratorGuard], (guard: AdministratorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
