import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconViewEyeComponent } from './icon-view-eye.component';

describe('IconViewEyeComponent', () => {
  let component: IconViewEyeComponent;
  let fixture: ComponentFixture<IconViewEyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconViewEyeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconViewEyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
