import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-excel-export',
  standalone: true,
  imports: [],
  templateUrl: './icon-excel-export.component.html',
  styleUrl: './icon-excel-export.component.scss',
})
export class IconExcelExportComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}
