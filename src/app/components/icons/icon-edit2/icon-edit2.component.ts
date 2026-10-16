import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-edit2',
  standalone: true,
  imports: [],
  templateUrl: './icon-edit2.component.html'
})
export class IconEdit2Component {
  @Input() color: string = '#001E39';
  @Input() size: string = '24px';
}
