import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconStep1CheckedComponent } from './icon-step-1-checked.component';

describe('IconStep1CheckedComponent', () => {
  let component: IconStep1CheckedComponent;
  let fixture: ComponentFixture<IconStep1CheckedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconStep1CheckedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconStep1CheckedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
