import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconLinkProcessComponent } from './icon-link-process.component';

describe('IconLinkProcessComponent', () => {
  let component: IconLinkProcessComponent;
  let fixture: ComponentFixture<IconLinkProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconLinkProcessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconLinkProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
