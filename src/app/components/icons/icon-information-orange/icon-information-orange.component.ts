import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-information-orange',
  standalone: true,
  imports: [],
  templateUrl: './icon-information-orange.component.html',
  styleUrl: './icon-information-orange.component.scss'
})
export class IconInformationOrangeComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = 'currentSize';
}
