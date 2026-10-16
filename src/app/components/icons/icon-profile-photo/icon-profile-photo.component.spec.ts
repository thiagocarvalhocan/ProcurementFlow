import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconProfilePhotoComponent } from './icon-profile-photo.component';

describe('IconProfilePhotoComponent', () => {
  let component: IconProfilePhotoComponent;
  let fixture: ComponentFixture<IconProfilePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconProfilePhotoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconProfilePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
