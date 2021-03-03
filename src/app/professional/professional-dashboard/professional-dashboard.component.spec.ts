import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfessionalDashboardComponent } from './professional-dashboard.component';
import { SharedModule } from '@app/shared';
import { ProfessionalModule } from '@app/professional/professional.module';
import { AuthenticationService, CoreModule } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '@app/app.module';

describe('ProfessionalDashboardComponent', () => {
  let component: ProfessionalDashboardComponent;
  let fixture: ComponentFixture<ProfessionalDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule, ProfessionalModule, AppRoutingModule, AppModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthenticationService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
