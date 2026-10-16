import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-icon-user-x',
  standalone: true,
  imports: [],
  templateUrl: './icon-user-x.component.html',
  styleUrl: './icon-user-x.component.scss'
})
export class IconUserXComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}