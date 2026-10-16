import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCleanComponent } from './icon-clean.component';

describe('IconCleanComponent', () => {
  let component: IconCleanComponent;
  let fixture: ComponentFixture<IconCleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCleanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconCleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
