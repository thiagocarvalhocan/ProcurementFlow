import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leftPad',
  standalone: true
})
export class LeftPadPipe implements PipeTransform {
  transform(value: any, size: number, char: string = '0'): any {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return value;
    }
    const valueString = String(value);
    if (valueString.length >= size) {
      return valueString;
    }
    const padding = char.repeat(size - valueString.length);
    return padding + valueString;
  }
}
