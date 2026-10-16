import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLayoutContentComponent } from './auth-layout-content.component';

describe('AuthLayoutContentComponent', () => {
  let component: AuthLayoutContentComponent;
  let fixture: ComponentFixture<AuthLayoutContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayoutContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthLayoutContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
