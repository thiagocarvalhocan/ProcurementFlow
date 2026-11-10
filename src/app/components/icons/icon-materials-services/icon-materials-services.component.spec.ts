import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMaterialsServicesComponent } from './icon-materials-services.component';

describe('IconMaterialsServicesComponent', () => {
  let component: IconMaterialsServicesComponent;
  let fixture: ComponentFixture<IconMaterialsServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMaterialsServicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconMaterialsServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
