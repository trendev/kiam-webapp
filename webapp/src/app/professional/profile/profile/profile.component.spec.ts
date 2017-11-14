import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { SharedModule } from '@app/shared';
import { CoreModule, AuthenticationService } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '@app/app.module';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule, AppRoutingModule, AppModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthenticationService],
      declarations: [ProfileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
