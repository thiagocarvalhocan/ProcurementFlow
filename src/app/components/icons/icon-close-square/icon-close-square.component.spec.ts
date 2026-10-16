import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCloseSquareComponent } from './icon-close-square.component';

describe('IconCloseSquareComponent', () => {
  let component: IconCloseSquareComponent;
  let fixture: ComponentFixture<IconCloseSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCloseSquareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconCloseSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
