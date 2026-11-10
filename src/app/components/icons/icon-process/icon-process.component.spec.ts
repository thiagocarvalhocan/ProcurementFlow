import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconProcessComponent } from './icon-process.component';

describe('IconProcessComponent', () => {
  let component: IconProcessComponent;
  let fixture: ComponentFixture<IconProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconProcessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
