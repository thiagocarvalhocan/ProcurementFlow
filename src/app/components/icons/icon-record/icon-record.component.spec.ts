import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconRecordComponent } from './icon-record.component';

describe('IconRecordComponent', () => {
  let component: IconRecordComponent;
  let fixture: ComponentFixture<IconRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
