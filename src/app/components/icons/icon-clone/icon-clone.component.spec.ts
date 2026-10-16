import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCloneComponent } from './icon-clone.component';

describe('IconCloneComponent', () => {
  let component: IconCloneComponent;
  let fixture: ComponentFixture<IconCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCloneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
