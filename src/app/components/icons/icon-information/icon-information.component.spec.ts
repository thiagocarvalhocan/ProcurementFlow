import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconInformationComponent } from './icon-information.component';

describe('IconInformationComponent', () => {
  let component: IconInformationComponent;
  let fixture: ComponentFixture<IconInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
