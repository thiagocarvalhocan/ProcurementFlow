import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconProfileComponent } from './icon-profile.component';

describe('IconProfileComponent', () => {
  let component: IconProfileComponent;
  let fixture: ComponentFixture<IconProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
