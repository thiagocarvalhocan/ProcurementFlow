import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconViewUnitComponent } from './icon-view-unit.component';

describe('IconViewUnitComponent', () => {
  let component: IconViewUnitComponent;
  let fixture: ComponentFixture<IconViewUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconViewUnitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconViewUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
