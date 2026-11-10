import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPanelComponent } from './unit-panel.component';

describe('UnitComponent', () => {
  let component: UnitPanelComponent;
  let fixture: ComponentFixture<UnitPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
