import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconLogoutComponent } from './icon-logout.component';

describe('IconLogoutComponent', () => {
  let component: IconLogoutComponent;
  let fixture: ComponentFixture<IconLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconLogoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
