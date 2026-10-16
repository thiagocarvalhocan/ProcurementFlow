import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconUserCheckComponent } from './icon-user-check.component';

describe('IconUserCheckComponent', () => {
  let component: IconUserCheckComponent;
  let fixture: ComponentFixture<IconUserCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconUserCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconUserCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});