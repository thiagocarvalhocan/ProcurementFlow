import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconContrastComponent } from './icon-contrast.component';

describe('IconContrastComponent', () => {
  let component: IconContrastComponent;
  let fixture: ComponentFixture<IconContrastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconContrastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconContrastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
