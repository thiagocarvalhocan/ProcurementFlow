import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHistoryComponent } from './icon-history.component';

describe('IconHistoryComponent', () => {
  let component: IconHistoryComponent;
  let fixture: ComponentFixture<IconHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});