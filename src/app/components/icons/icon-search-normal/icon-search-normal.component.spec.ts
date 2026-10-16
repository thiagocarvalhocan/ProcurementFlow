import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSearchNormalComponent } from './icon-search-normal.component';

describe('IconSearchNormalComponent', () => {
  let component: IconSearchNormalComponent;
  let fixture: ComponentFixture<IconSearchNormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSearchNormalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconSearchNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
