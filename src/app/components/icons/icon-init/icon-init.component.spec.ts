import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconInitComponent } from './icon-init.component';

describe('IconInitComponent', () => {
  let component: IconInitComponent;
  let fixture: ComponentFixture<IconInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconInitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
