import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconExpandComponent } from './icon-expand.component';

describe('IconExpandComponent', () => {
  let component: IconExpandComponent;
  let fixture: ComponentFixture<IconExpandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconExpandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
