import { Directive, ElementRef, HostListener, Input, Optional, Self, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMaxChars]',
  standalone: true
})
export class MaxCharsDirective {

  @Input() appMaxChars = 500;

  @Output() maxCharsChange = new EventEmitter<number>();

  constructor(
    private el: ElementRef<HTMLTextAreaElement>,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  @HostListener('input')
  onInput(): void {
    const element = this.el.nativeElement;
    let value = element.value || '';

    if (value.length > this.appMaxChars) {
      value = value.substring(0, this.appMaxChars);
      element.value = value;

      if (this.ngControl?.control) {
        this.ngControl.control.setValue(value, { emitEvent: false });
      }
    }

    this.maxCharsChange.emit(value.length);
  }
}
