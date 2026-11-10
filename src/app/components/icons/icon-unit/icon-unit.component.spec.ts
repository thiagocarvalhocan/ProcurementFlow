import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconUnitComponent } from './icon-unit.component';

describe('IconUnitComponent', () => {
  let component: IconUnitComponent;
  let fixture: ComponentFixture<IconUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconUnitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
