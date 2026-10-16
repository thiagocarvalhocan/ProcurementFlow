import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-step-2',
  standalone: true,
  imports: [],
  templateUrl: './icon-step-2.component.html',
  styleUrl: './icon-step-2.component.scss'
})
export class IconStep2Component {
  @Input() color: string = '#ffffff';
  @Input() size: string = '28px';
}
