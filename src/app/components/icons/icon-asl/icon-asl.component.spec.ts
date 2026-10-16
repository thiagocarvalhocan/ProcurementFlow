import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconAslComponent } from './icon-asl.component';

describe('IconAslComponent', () => {
  let component: IconAslComponent;
  let fixture: ComponentFixture<IconAslComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconAslComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconAslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
