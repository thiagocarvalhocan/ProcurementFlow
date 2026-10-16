import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-step-2-disabled',
  standalone: true,
  imports: [],
  templateUrl: './icon-step-2-disabled.component.html',
  styleUrl: './icon-step-2-disabled.component.scss'
})
export class IconStep2DisabledComponent {
  @Input() color: string = 'white';
  @Input() size: string = '28px';
}
