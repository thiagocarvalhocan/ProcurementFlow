import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-unit',
  standalone: true,
  imports: [],
  templateUrl: './icon-unit.component.html',
  styleUrl: './icon-unit.component.scss',
})
export class IconUnitComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = 'currentSize';
}
