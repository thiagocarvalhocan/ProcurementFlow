import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-trash',
  standalone: true,
  imports: [],
  templateUrl: './icon-trash.component.html',
  styleUrl: './icon-trash.component.scss'
})
export class IconTrashComponent {
  @Input() color: string = '#BD2130';
  @Input() size: string = '24px';
}
