import { TestBed, async, inject } from '@angular/core/testing';

import { ProfessionalGuard } from './professional.guard';
import { AuthenticationService, CoreModule } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { SharedModule } from '@app/shared';
import { APP_BASE_HREF } from '@angular/common';

describe('ProfessionalGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, AppRoutingModule, SharedModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        ProfessionalGuard,
        AuthenticationService]
    });
  });

  it('should ...', inject([ProfessionalGuard], (guard: ProfessionalGuard) => {
    expect(guard).toBeTruthy();
  }));
});
