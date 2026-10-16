import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGraphicComponent } from './icon-graphic.component';

describe('IconGraphicComponent', () => {
  let component: IconGraphicComponent;
  let fixture: ComponentFixture<IconGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconGraphicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
