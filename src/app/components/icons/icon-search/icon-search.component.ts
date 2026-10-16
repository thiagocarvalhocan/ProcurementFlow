import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-search',
  standalone: true,
  imports: [],
  templateUrl: './icon-search.component.html',
  styleUrl: './icon-search.component.scss'
})
export class IconSearchComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}
