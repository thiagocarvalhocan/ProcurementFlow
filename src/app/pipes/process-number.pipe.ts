import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'processNumber',
  standalone: true,
})
export class ProcessNumberPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';
    const numberStr = value.toString().padStart(8, '0');
    return numberStr.substring(0, 4) + '/' + numberStr.substring(4);
  }
}
