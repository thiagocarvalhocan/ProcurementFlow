import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-calendar',
  standalone: true,
  imports: [],
  templateUrl: './icon-calendar.component.html',
  styleUrl: './icon-calendar.component.scss'
})
export class IconCalendarComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '100%';
}
