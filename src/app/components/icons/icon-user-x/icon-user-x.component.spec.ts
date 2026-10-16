import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconUserXComponent } from './icon-user-x.component';

describe('IconUserXComponent', () => {
  let component: IconUserXComponent;
  let fixture: ComponentFixture<IconUserXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconUserXComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconUserXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});