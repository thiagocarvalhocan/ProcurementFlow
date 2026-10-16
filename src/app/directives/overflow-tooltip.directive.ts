import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Output
} from '@angular/core';

@Directive({
  selector: '[appOverflowTooltip]',
  standalone: true
})
export class OverflowTooltipDirective implements AfterViewInit {

  @Output() overflowChange = new EventEmitter<boolean>();

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;

    const hasOverflow =
      element.scrollWidth > element.clientWidth;

    queueMicrotask(() => {
      this.overflowChange.emit(hasOverflow);
    });
  }
}
