import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMenu3Component } from './icon-menu-3.component';

describe('IconMenu3Component', () => {
  let component: IconMenu3Component;
  let fixture: ComponentFixture<IconMenu3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMenu3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconMenu3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});