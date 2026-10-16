import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { IconCloseSquareComponent } from '../../icons/icon-close-square/icon-close-square.component';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-view-alerts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    IconCloseSquareComponent,
    CardModule,
  ],
  templateUrl: './view-alerts.component.html',
})
export class ViewAlertsComponent {
  @Input() visible = false;
  @Input() alerts: any[] = [];

  @Output() close = new EventEmitter<void>();

  alertForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.alertForm = this.fb.group({});
  }

  onClose(): void {
    this.close.emit();
  }

  isAlertValid(alert: any): boolean {
    return (
      Array.isArray(alert?.alerts) &&
      alert.alerts.length > 0 &&
      alert.alerts.some((msg: any) => msg != null)
    );
  }
}
