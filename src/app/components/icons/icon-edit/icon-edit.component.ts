import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-edit',
  standalone: true,
  imports: [],
  templateUrl: './icon-edit.component.html',
  styleUrl: './icon-edit.component.scss'
})
export class IconEditComponent {
  @Input() color: string = '#001E39';
  @Input() size: string = '28px';
}
