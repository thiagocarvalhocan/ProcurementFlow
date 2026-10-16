import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-add-unit',
  standalone: true,
  imports: [],
  templateUrl: './icon-add-unit.component.html',
  styleUrl: './icon-add-unit.component.scss',
})
export class IconAddUnitComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '16px';
}
