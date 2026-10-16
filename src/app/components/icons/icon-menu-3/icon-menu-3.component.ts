import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-icon-menu-3',
  standalone: true,
  imports: [],
  templateUrl: './icon-menu-3.component.html',
  styleUrl: './icon-menu-3.component.scss'
})
export class IconMenu3Component {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}