import { Component, EventEmitter, Output } from '@angular/core';
import { IconContrastComponent } from '../icons/icon-contrast/icon-contrast.component';
import { IconAslComponent } from '../icons/icon-asl/icon-asl.component';

@Component({
  selector: 'app-accessibility-controls',
  standalone: true,
  imports: [IconContrastComponent, IconAslComponent],
  templateUrl: './accessibility-controls.component.html',
  styleUrl: './accessibility-controls.component.scss',
})
export class AccessibilityControlsComponent {
  @Output() fontChange = new EventEmitter<'increase' | 'decrease' | 'reset'>();
  @Output() toggleSignLanguage = new EventEmitter<void>();
  @Output() toggleContrast = new EventEmitter<void>();

  onFontClick(type: 'increase' | 'decrease' | 'reset') {
    this.fontChange.emit(type);
  }

  onSignLanguageClick() {
    this.toggleSignLanguage.emit();
  }

  onContrastClick() {
    this.toggleContrast.emit();
  }
}
