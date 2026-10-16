import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private messageService: MessageService) {}

  warn(detail: string, summary = 'Warning') {
    this.messageService.add({ severity: 'warn', summary, detail });
  }

  success(detail: string, summary = 'Success') {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  error(detail: string, summary = 'Error') {
    this.messageService.add({ severity: 'error', summary, detail });
  }
}
