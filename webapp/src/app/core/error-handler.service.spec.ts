import { CoreModule } from './core.module';
import { AuthenticationService } from './authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { TestBed, inject, async } from '@angular/core/testing';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule
      ],
      providers: [
        ErrorHandlerService,
        AuthenticationService
      ]
    });
  });

  afterEach(() => {
    if (subscription && !subscription.closed) {
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy('subscription should be closed');
    }
  });

  it('should be created', inject([ErrorHandlerService], (service: ErrorHandlerService) => {
    expect(service).toBeTruthy();
  }));

  it('should handle an Error', async(inject([ErrorHandlerService], (service: ErrorHandlerService) => {
    expect(service).toBeTruthy();
    const TEST_ERROR = 'TEST_ERROR';
    try {
      throw new Error(TEST_ERROR);
    } catch (e) {
      const errobs = service.handle(e);
      expect(service.errmsg).toEqual(TEST_ERROR);
      expect(errobs).toBeDefined();
      subscription = errobs.subscribe(
        data => expect(data).toBeUndefined('errobs should not have data'),
        error => expect(error).toEqual(TEST_ERROR));
    }
  })));

  it('should handle a HttpErrorResponse - 403 Forbidden', async(inject([
    ErrorHandlerService,
    AuthenticationService
  ], (errsrv: ErrorHandlerService, authsrv: AuthenticationService) => {
    expect(errsrv).toBeTruthy();
    subscription = authsrv.profile().subscribe(
      data => expect(data).toBeUndefined('authsrv.profile() should fail and return no data'),
      error => {
        expect(error).toContain('403', 'should contain 403 Forbidden');
        expect(errsrv.errmsg).toBeDefined();
        expect(errsrv.errmsg).toContain('403', 'should contain 403 Forbidden');
      }
    );
  })));
});
