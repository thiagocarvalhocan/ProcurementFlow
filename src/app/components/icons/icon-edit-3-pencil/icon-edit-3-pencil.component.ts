import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-edit-3-pencil',
  standalone: true,
  imports: [],
  templateUrl: './icon-edit-3-pencil.component.html',
  styleUrl: './icon-edit-3-pencil.component.scss'
})
export class IconEdit3PencilComponent {
  @Input() color: string = '#000000';
  @Input() size: string = '24px';
}
