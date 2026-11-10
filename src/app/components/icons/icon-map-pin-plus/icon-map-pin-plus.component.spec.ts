import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMapPinPlusComponent } from './icon-map-pin-plus.component';

describe('IconMapPinPlusComponent', () => {
  let component: IconMapPinPlusComponent;
  let fixture: ComponentFixture<IconMapPinPlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMapPinPlusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconMapPinPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
