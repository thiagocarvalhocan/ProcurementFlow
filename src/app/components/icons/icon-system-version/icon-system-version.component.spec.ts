import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSystemVersionComponent } from './icon-system-version.component';

describe('IconSystemVersionComponent', () => {
  let component: IconSystemVersionComponent;
  let fixture: ComponentFixture<IconSystemVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSystemVersionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSystemVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
