import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-information',
  standalone: true,
  imports: [],
  templateUrl: './icon-information.component.html',
  styleUrl: './icon-information.component.scss'
})
export class IconInformationComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = 'currentSize';
}
