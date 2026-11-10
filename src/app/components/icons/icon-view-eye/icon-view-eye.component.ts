import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-view-eye',
  standalone: true,
  imports: [],
  templateUrl: './icon-view-eye.component.html',
  styleUrl: './icon-view-eye.component.scss'
})
export class IconViewEyeComponent {
  @Input() color: string = '#000000';
  @Input() size: string = '24px';
}
