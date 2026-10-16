import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-icon-settings',
  standalone: true,
  imports: [],
  templateUrl: './icon-settings.component.html',
  styleUrl: './icon-settings.component.scss'
})
export class IconSettingsComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '16px';
}
