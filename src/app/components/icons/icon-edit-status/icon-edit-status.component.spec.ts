import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEditStatusComponent } from './icon-edit-status.component';

describe('IconEditStatusComponent', () => {
  let component: IconEditStatusComponent;
  let fixture: ComponentFixture<IconEditStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEditStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEditStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
