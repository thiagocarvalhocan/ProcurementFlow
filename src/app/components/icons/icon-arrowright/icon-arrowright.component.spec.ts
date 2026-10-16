import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconArrowrightComponent } from './icon-arrowright.component';

describe('IconArrowrightComponent', () => {
  let component: IconArrowrightComponent;
  let fixture: ComponentFixture<IconArrowrightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconArrowrightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconArrowrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
