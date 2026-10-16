import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHomeTrendUpComponent } from './icon-home-trend-up.component';

describe('IconHomeTrendUpComponent', () => {
  let component: IconHomeTrendUpComponent;
  let fixture: ComponentFixture<IconHomeTrendUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHomeTrendUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconHomeTrendUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
