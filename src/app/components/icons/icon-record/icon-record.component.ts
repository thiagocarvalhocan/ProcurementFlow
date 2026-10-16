import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-record',
  standalone: true,
  imports: [],
  templateUrl: './icon-record.component.html',
  styleUrl: './icon-record.component.scss',
})
export class IconRecordComponent {
  @Input() color: string = '#0F4C5C';
  @Input() size: string = 'currentSize';
}
