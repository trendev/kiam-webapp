import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalSidenavComponent } from './professional-sidenav.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';
import { APP_BASE_HREF } from '@angular/common';

describe('ProfessionalSidenavComponent', () => {
  let component: ProfessionalSidenavComponent;
  let fixture: ComponentFixture<ProfessionalSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule, AppRoutingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      declarations: [ProfessionalSidenavComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
