import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true,
})
export class OnlyNumbersDirective {

  @Input() appOnlyNumbers: number | undefined;

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    let value = input.value ?? '';

    value = value.replace(/\D+/g, '');

    if (this.appOnlyNumbers && value.length > this.appOnlyNumbers) {
      value = value.slice(0, this.appOnlyNumbers);
    }

    input.value = value;
  }
}
