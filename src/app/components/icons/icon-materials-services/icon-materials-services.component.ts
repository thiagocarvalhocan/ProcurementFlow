import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-materials-services',
  standalone: true,
  imports: [],
  templateUrl: './icon-materials-services.component.html',
  styleUrl: './icon-materials-services.component.scss',
})
export class IconMaterialsServicesComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '24px';
}
