import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceRequestViewComponent } from './advance-request-view.component';

describe('AdvanceRequestViewComponent', () => {
  let component: AdvanceRequestViewComponent;
  let fixture: ComponentFixture<AdvanceRequestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceRequestViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvanceRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
