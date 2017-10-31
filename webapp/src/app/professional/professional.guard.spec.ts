import { TestBed, async, inject } from '@angular/core/testing';

import { ProfessionalGuard } from './professional.guard';

describe('ProfessionalGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfessionalGuard]
    });
  });

  it('should ...', inject([ProfessionalGuard], (guard: ProfessionalGuard) => {
    expect(guard).toBeTruthy();
  }));
});
