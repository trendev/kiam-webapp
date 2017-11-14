import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCardComponent } from './login-card.component';
import { SharedModule } from '@app/shared';
import { CoreModule, AuthenticationService } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { DispatcherService } from '@app/login/dispatcher.service';
import { APP_BASE_HREF } from '@angular/common';
import { CredentialsManagerService } from '@app/login/credentials-manager.service';
import { AppModule } from '@app/app.module';

describe('LoginCardComponent', () => {
  let component: LoginCardComponent;
  let fixture: ComponentFixture<LoginCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, CoreModule, AppRoutingModule, AppModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthenticationService,
        DispatcherService,
        CredentialsManagerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
