import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectCallbackComponent } from './redirect-callback.component';

describe('RedirectCallbackComponent', () => {
  let component: RedirectCallbackComponent;
  let fixture: ComponentFixture<RedirectCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
