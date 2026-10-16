import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numeroProcesso',
  standalone: true,
})
export class ProcessNumberPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';
    const numeroStr = value.toString().padStart(8, '0');
    return numeroStr.substring(0, 4) + '/' + numeroStr.substring(4);
  }
}
