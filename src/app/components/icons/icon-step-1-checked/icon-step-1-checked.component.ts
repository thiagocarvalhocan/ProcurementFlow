import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-step-1-checked',
  standalone: true,
  imports: [],
  templateUrl: './icon-step-1-checked.component.html',
  styleUrl: './icon-step-1-checked.component.scss'
})
export class IconStep1CheckedComponent {
  @Input() color: string = '#ffffff';
  @Input() size: string = '28px';
}
