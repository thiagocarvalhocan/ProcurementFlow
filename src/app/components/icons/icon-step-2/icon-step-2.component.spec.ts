import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconStep2Component } from './icon-step-2.component';

describe('IconStep2Component', () => {
  let component: IconStep2Component;
  let fixture: ComponentFixture<IconStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconStep2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
