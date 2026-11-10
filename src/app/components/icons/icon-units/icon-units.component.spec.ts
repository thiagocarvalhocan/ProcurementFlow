import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconUnitsComponent } from './icon-units.component';

describe('IconUnitsComponent', () => {
  let component: IconUnitsComponent;
  let fixture: ComponentFixture<IconUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconUnitsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
