import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-icon-history',
  standalone: true,
  imports: [],
  templateUrl: './icon-history.component.html',
  styleUrl: './icon-history.component.scss'
})
export class IconHistoryComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}