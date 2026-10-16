import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconExcelExportComponent } from './icon-excel-export.component';

describe('IconExcelExportComponent', () => {
  let component: IconExcelExportComponent;
  let fixture: ComponentFixture<IconExcelExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconExcelExportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconExcelExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
