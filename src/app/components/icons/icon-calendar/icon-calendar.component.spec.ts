import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCalendarComponent } from './icon-calendar.component';

describe('IconCalendarComponent', () => {
  let component: IconCalendarComponent;
  let fixture: ComponentFixture<IconCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
