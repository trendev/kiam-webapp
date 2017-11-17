import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfoComponent } from './account-info.component';
import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';

describe('AccountInfoComponent', () => {
  let component: AccountInfoComponent;
  let fixture: ComponentFixture<AccountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
