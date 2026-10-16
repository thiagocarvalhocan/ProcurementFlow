import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'companyTaxId',
  standalone: true
})
export class CompanyTaxIdPipe implements PipeTransform {

  transform(value: string | number | null | undefined): string {
    if (!value) return '';

    const clean = value
      .toString()
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase();

    if (clean.length !== 14) return value.toString();

    return clean.replace(
      /^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})([A-Z0-9]{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }

}