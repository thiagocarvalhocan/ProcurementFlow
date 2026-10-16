import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconAddUnitComponent } from './icon-add-unit.component';

describe('IconAddUnitComponent', () => {
  let component: IconAddUnitComponent;
  let fixture: ComponentFixture<IconAddUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconAddUnitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconAddUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
