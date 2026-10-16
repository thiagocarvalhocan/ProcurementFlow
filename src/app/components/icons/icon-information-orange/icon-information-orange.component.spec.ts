import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconInformationOrangeComponent } from './icon-information-orange.component';

describe('IconInformationOrangeComponent', () => {
  let component: IconInformationOrangeComponent;
  let fixture: ComponentFixture<IconInformationOrangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconInformationOrangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconInformationOrangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
