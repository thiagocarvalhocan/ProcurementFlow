import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconStep2DisabledComponent } from './icon-step-2-disabled.component';

describe('IconStep2DisabledComponent', () => {
  let component: IconStep2DisabledComponent;
  let fixture: ComponentFixture<IconStep2DisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconStep2DisabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconStep2DisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
