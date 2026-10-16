import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconStep1Component } from './icon-step-1.component';

describe('IconStep1Component', () => {
  let component: IconStep1Component;
  let fixture: ComponentFixture<IconStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconStep1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
