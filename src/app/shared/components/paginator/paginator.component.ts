import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { IconChevronDownComponent } from '../../../components/icons/icon-chevron-down/icon-chevron-down.component';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, DropdownModule, PaginatorModule, FormsModule, IconChevronDownComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  @Input() first: number = 0;
  @Input() last: number = 0;
  @Input() totalItems: number = 0;
  @Input() rows: number = 10;
  @Input() options: { label: number; value: number }[] = [];

  @Output() rowsChange = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<any>();

  onChangeRows(value: number) {
    this.rowsChange.emit(value);
  }

  onPageChange(event: any) {
    this.pageChange.emit(event);
  }
}
