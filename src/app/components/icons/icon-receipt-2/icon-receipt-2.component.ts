import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-receipt-2',
  standalone: true,
  imports: [],
  templateUrl: './icon-receipt-2.component.html',
  styleUrl: './icon-receipt-2.component.scss'
})
export class IconReceipt2Component {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}
