import {
  Administrator,
  Individual,
  Professional,
  UserAccount,
  UserAccountType,
  CustomerDetails
} from '@app/entities';
import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { TestBed, inject, async } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { Subscription } from 'rxjs/Subscription';

describe('AuthService', () => {

  const username = 'vanessa.gay@gmail.com';
  const password = 'ponpon';

  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule
      ],
      providers: [AuthenticationService]
    });
  });

  afterEach(() => {
    if (subscription && !subscription.closed) {
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy('subscription should be closed');
    }
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
    expect(service.user).toBeUndefined();
    expect(service.redirectUrl).toBeUndefined();
    expect(service.api).toBe(`${environment.api}/Authentication`);
  }));

  it('should login ' + username, async(inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
    subscription = service.login(username, password).subscribe(result => {
      expect(result).toBe(true);
      expect(service.user).toBeTruthy();
      expect(service.user.cltype).toBe(UserAccountType.PROFESSIONAL);
      expect(service.isLoggedIn).toBe(true);
    });
  })));

  it('should get an updated profile of ' + username, async(inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
    subscription = service.profile().subscribe(p => {
      expect(p).toBeTruthy();
      expect(p.cltype).toBe(UserAccountType.PROFESSIONAL);
      expect(service.user).toBeTruthy();
      expect(service.user.cltype).toBe(UserAccountType.PROFESSIONAL);
      expect(service.isLoggedIn).toBe(true);
      // expect(service.user instanceof UserAccount).toBe(true, 'wrong type');
    });
  })));

  it('should logout ' + username, async(inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
    subscription = service.logout().subscribe(result => {
      expect(result).toBe(true);
      expect(service.user).toBeUndefined();
      expect(service.isLoggedIn).toBe(false);
    });
  })));
});
