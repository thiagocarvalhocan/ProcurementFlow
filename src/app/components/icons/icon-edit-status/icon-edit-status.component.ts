import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-edit-status',
  standalone: true,
  imports: [],
  templateUrl: './icon-edit-status.component.html',
  styleUrl: './icon-edit-status.component.scss',
})
export class IconEditStatusComponent {
  @Input() color: string = '#12684C';
  @Input() size: string = '24px';
}
