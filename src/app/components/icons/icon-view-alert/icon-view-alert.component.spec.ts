import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconViewAlertComponent } from './icon-view-alert.component';

describe('IconViewAlertComponent', () => {
  let component: IconViewAlertComponent;
  let fixture: ComponentFixture<IconViewAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconViewAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconViewAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
