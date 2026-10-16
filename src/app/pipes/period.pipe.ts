import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'period',
  standalone: true,
})
export class PeriodPipe implements PipeTransform {
  private datePipe = inject(DatePipe);

  transform(item: {
    startDate?: Date | string;
    endDate?: Date | string;
  }): string {
    const format = (date?: Date | string): string => {
      if (!date) return '';
      const result = this.datePipe.transform(date, 'dd/MM/yyyy');
      return result ?? '';
    };

    const start = format(item?.startDate);
    const end = format(item?.endDate);

    if (start && end) {
      return `${start} to ${end}`;
    } else if (start) {
      return start;
    } else if (end) {
      return end;
    } else {
      return '-';
    }
  }
}
