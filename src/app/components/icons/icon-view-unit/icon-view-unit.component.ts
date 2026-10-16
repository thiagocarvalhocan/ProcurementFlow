import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-view-unit',
  standalone: true,
  imports: [],
  templateUrl: './icon-view-unit.component.html',
  styleUrl: './icon-view-unit.component.scss',
})
export class IconViewUnitComponent {
  @Input() color: string = '#000000';
  @Input() size: string = '24px';
}
