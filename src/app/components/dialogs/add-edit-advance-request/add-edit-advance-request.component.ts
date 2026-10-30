import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { IconCloseSquareComponent } from '../../icons/icon-close-square/icon-close-square.component';
import { IconSaveComponent } from '../../icons/icon-save/icon-save.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-add-edit-advance-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    IconCloseSquareComponent,
    IconSaveComponent,
  ],
  templateUrl: './add-edit-advance-request.component.html',
  styleUrl: './add-edit-advance-request.component.scss',
})
export class AddEditAdvanceRequestComponent {
  @Input() mode: 'add' | 'edit' | 'view' = 'view';
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Input() advanceRequestDetail: any = null;
  @Input() newRequest: any = null;
  @Input() months: any[] = [];
  @Input() currentYear?: number;
  @Input() unitDescription: string = '';
  @Input() messageFormatted: SafeHtml = '';
  @Input() newRequestFormatted: SafeHtml = '';
  @Input() isRequest: boolean = false;

  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();
  @Output() checkboxChange = new EventEmitter<any>();

  constructor(private sanitizer: DomSanitizer) {}

  get isAdd(): boolean {
    return this.mode === 'add';
  }

  get isEdit(): boolean {
    return this.mode === 'edit';
  }

  get isView(): boolean {
    return this.mode === 'view';
  }

  get header(): string {
    if (this.isAdd) return 'Add Advance Request - Monthly Budget';
    if (this.isEdit) return 'Edit Advance Request - Monthly Budget';
    return 'View Advance Request - Monthly Budget';
  }

  get saveLabel(): string {
    return this.isAdd ? 'Add' : 'Edit';
  }

  onCheckboxChange(month: any): void {
    if (!this.isView) {
      this.checkboxChange.emit(month);
    }
  }

  onSave(): void {
    this.save.emit(this.saveLabel);
  }

  onCancel(): void {
    this.cancel.emit(this.saveLabel);
  }

  close(): void {
    this.isVisibleChange.emit(false);
    this.closed.emit();
  }
}
