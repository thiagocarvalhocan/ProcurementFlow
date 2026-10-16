import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTickCircleComponent } from './icon-tick-circle.component';

describe('IconTickCircleComponent', () => {
  let component: IconTickCircleComponent;
  let fixture: ComponentFixture<IconTickCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTickCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconTickCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
