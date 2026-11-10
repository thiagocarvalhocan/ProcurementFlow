import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialServiceUnitComponent } from './material-service-unit.component';

describe('MaterialServiceUnitComponent', () => {
  let component: MaterialServiceUnitComponent;
  let fixture: ComponentFixture<MaterialServiceUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialServiceUnitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialServiceUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
