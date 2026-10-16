import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconArrowbackComponent } from './icon-arrowback.component';

describe('IconArrowbackComponent', () => {
  let component: IconArrowbackComponent;
  let fixture: ComponentFixture<IconArrowbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconArrowbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconArrowbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
