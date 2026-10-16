import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OverflowTooltipDirective } from './overflow-tooltip.directive';

@Component({
  standalone: true,
  selector: 'app-overflow-tooltip-host',
  imports: [OverflowTooltipDirective],
  template: '<div appOverflowTooltip>long content</div>',
})
class OverflowTooltipHostComponent {}

describe('OverflowTooltipDirective', () => {
  let fixture: ComponentFixture<OverflowTooltipHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverflowTooltipHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverflowTooltipHostComponent);
  });

  it('should create an instance', () => {
    expect(
      fixture.debugElement.query(By.directive(OverflowTooltipDirective))
    ).toBeTruthy();
  });

  it('reports the overflow state once the view is initialized', async () => {
    const emitted: boolean[] = [];

    fixture.debugElement
      .query(By.directive(OverflowTooltipDirective))
      .injector.get(OverflowTooltipDirective)
      .overflowChange.subscribe((value: boolean) => emitted.push(value));

    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(emitted.length).toBe(1);
    expect(typeof emitted[0]).toBe('boolean');
  });
});
