import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconReceipt2Component } from './icon-receipt-2.component';

describe('IconReceipt2Component', () => {
  let component: IconReceipt2Component;
  let fixture: ComponentFixture<IconReceipt2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconReceipt2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconReceipt2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
