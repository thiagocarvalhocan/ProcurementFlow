import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-icon-chevron-down',
  standalone: true,
  imports: [],
  templateUrl: './icon-chevron-down.component.html',
  styleUrl: './icon-chevron-down.component.scss'
})
export class IconChevronDownComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}