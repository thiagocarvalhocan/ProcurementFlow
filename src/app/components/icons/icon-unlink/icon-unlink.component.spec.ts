import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconUnlinkComponent } from './icon-unlink.component';

describe('IconUnlinkComponent', () => {
  let component: IconUnlinkComponent;
  let fixture: ComponentFixture<IconUnlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconUnlinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconUnlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
