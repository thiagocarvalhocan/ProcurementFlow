import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-save',
  standalone: true,
  imports: [],
  templateUrl: './icon-save.component.html',
  styleUrl: './icon-save.component.scss',
})
export class IconSaveComponent {
  @Input() color: string = '#0F4C5C';
  @Input() size: string = '24px';
}
