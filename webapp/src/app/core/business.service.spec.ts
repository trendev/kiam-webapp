import { TestBed, inject, async } from '@angular/core/testing';

import { BusinessService } from './business.service';
import { CoreModule } from './core.module';
import { AuthenticationService } from './authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { UserAccountType, Business } from '@app/entities';

describe('BusinessService', () => {

  const username = 'vanessa.gay@gmail.com';
  const password = 'ponpon';

  let loginSuscription: Subscription;
  let logoutSuscription: Subscription;
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule],
      providers: [BusinessService]
    });
  });

  beforeEach(async(inject([AuthenticationService],
    (authService: AuthenticationService) => {
      loginSuscription = authService.login(username, password).subscribe(result => { });
    })));

  afterEach(async(inject([AuthenticationService],
    (authService: AuthenticationService) => {
      logoutSuscription = authService.logout().subscribe(result => { });
    })));

  afterEach(() => {
    if (loginSuscription && !loginSuscription.closed) {
      loginSuscription.unsubscribe();
      expect(loginSuscription.closed).toBeTruthy('subscription should be closed');
    }
    if (logoutSuscription && !logoutSuscription.closed) {
      logoutSuscription.unsubscribe();
      expect(logoutSuscription.closed).toBeTruthy('subscription should be closed');
    }
  });

  it('should be created', async(inject([BusinessService], (service: BusinessService) => {
    expect(service).toBeTruthy();
    subscription = service.businesses.subscribe(
      result => {
        expect(result.length).toBeGreaterThanOrEqual(3, 'result.length should be 3');
        expect(result.filter(b => b instanceof Business).length).toBeGreaterThanOrEqual(3, 'result should contains Business objects');
      });
  })));
});
