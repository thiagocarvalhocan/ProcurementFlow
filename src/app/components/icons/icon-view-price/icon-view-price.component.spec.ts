import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconViewPriceComponent } from './icon-view-price.component';

describe('IconViewPriceComponent', () => {
  let component: IconViewPriceComponent;
  let fixture: ComponentFixture<IconViewPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconViewPriceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconViewPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
