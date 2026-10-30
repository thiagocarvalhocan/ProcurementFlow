import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconCloseSquareComponent } from '../../icons/icon-close-square/icon-close-square.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-advance-request-view',
  standalone: true,
  imports: [
    CommonModule,
    IconCloseSquareComponent,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    FormsModule,
  ],
  templateUrl: './advance-request-view.component.html',
  styleUrl: './advance-request-view.component.scss',
})
export class AdvanceRequestViewComponent {
  @Input() isVisible: boolean = false;
  @Input() advanceRequestDetail: any;
  @Input() months: any[] = [];
  @Input() currentYear?: number;
  @Input() isRequest: boolean = false;
  @Input() unitDescriptionCurrent: string = '';

  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  close() {
    this.isVisibleChange.emit(false);
    this.closed.emit();
  }
}
