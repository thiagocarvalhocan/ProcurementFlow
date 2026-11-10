import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEdit3PencilComponent } from './icon-edit-3-pencil.component';

describe('IconEdit3PencilComponent', () => {
  let component: IconEdit3PencilComponent;
  let fixture: ComponentFixture<IconEdit3PencilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEdit3PencilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconEdit3PencilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
