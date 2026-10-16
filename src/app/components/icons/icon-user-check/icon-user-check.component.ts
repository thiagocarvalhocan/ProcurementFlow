import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-icon-user-check',
  standalone: true,
  imports: [],
  templateUrl: './icon-user-check.component.html',
  styleUrl: './icon-user-check.component.scss'
})
export class IconUserCheckComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}