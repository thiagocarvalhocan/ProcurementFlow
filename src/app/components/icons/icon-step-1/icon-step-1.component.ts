import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-step-1',
  standalone: true,
  imports: [],
  templateUrl: './icon-step-1.component.html',
  styleUrl: './icon-step-1.component.scss'
})
export class IconStep1Component {
  @Input() color: string = '#ffffff';
  @Input() size: string = '28px';
}
