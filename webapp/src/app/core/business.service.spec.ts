import { TestBed, inject, async } from '@angular/core/testing';

import { BusinessService } from './business.service';
import { CoreModule } from './core.module';
import { AuthenticationService } from './authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { UserAccountType, Business } from '@app/entities';

describe('BusinessService', () => {

  const username = 'vanessa.gay@gmail.com';
  const password = 'ponpon';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule],
      providers: [BusinessService]
    });
  });

  beforeEach(async(inject([AuthenticationService],
    (authService: AuthenticationService) =>
      authService.login(username, password).subscribe(result => { })
  )));

  afterEach(async(inject([AuthenticationService],
    (authService: AuthenticationService) =>
      authService.logout().subscribe(result => console.log(`BusinessServiceTest#logout()`))
  )));

  it('should get the businesses', async(inject([BusinessService], (service: BusinessService) => {
    expect(service).toBeTruthy();
    service.businesses.subscribe(
      result => {
        expect(result.length).toBeGreaterThanOrEqual(3, 'result.length should be 3');
        expect(result.filter(b => b instanceof Business).length).toBeGreaterThanOrEqual(3, 'result should contains Business objects');
      });
  })));
});
