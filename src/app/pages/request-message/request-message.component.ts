import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { EditorModule, Editor, EditorTextChangeEvent } from 'primeng/editor';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { IconAddSquareComponent } from '../../components/icons/icon-add-square/icon-add-square.component';
import { AdvanceRequestMessageService } from '../../services/advance-request-message.service';
import { IconCloseSquareComponent } from '../../components/icons/icon-close-square/icon-close-square.component';
import { IconSaveComponent } from '../../components/icons/icon-save/icon-save.component';
import { IconViewComponent } from '../../components/icons/icon-view/icon-view.component';
import { IconEdit2Component } from '../../components/icons/icon-edit2/icon-edit2.component';
import { IconDeleteComponent } from '../../components/icons/icon-delete/icon-delete.component';
import { UserPermissionService } from '../../services/user-permission.service';
import { AdvanceMessage } from '../../models/AdvanceMessage';
import { TooltipModule } from 'primeng/tooltip';
import { IconCalendarComponent } from '../../components/icons/icon-calendar/icon-calendar.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PeriodPipe } from '../../pipes/period.pipe';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import Quill from 'quill';
import { AdvanceRequestMessageResponse } from '../../models/response/AdvanceRequestMessageResponse';

@Component({
  selector: 'app-request-message',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    CardModule,
    ButtonModule,
    IconAddSquareComponent,
    TableModule,
    DialogModule,
    IconCloseSquareComponent,
    ReactiveFormsModule,
    EditorModule,
    CalendarModule,
    DropdownModule,
    IconSaveComponent,
    IconViewComponent,
    TagModule,
    FormsModule,
    IconEdit2Component,
    IconDeleteComponent,
    PaginatorModule,
    TooltipModule,
    IconCalendarComponent,
    PeriodPipe,
    PaginatorComponent,
  ],
  providers: [MessageService, DatePipe],
  styleUrl: './request-message.component.scss',
  templateUrl: './request-message.component.html',
})
export class RequestMessageComponentt implements AfterViewInit {
  [x: string]: any;
  sortStates: { [key: string]: number } = {};
  editorCharacterLimitExceeded: boolean = false;
  isValidEditDataInicio: boolean = false;
  @ViewChild('tb') tb!: Table;
  @ViewChild('tb2') tb2!: Table;
  @ViewChild('editorRef') editorRef!: Editor;
  @ViewChild('editorRefDynamic') editorRefDynamic!: Editor;

  messageSuccess = 'Operation completed successfully!';
  months = [
    { name: 'January', code: '1' },
    { name: 'February', code: '2' },
    { name: 'March', code: '3' },
    { name: 'April', code: '4' },
    { name: 'May', code: '5' },
    { name: 'June', code: '6' },
    { name: 'July', code: '7' },
    { name: 'August', code: '8' },
    { name: 'September', code: '9' },
    { name: 'October', code: '10' },
    { name: 'November', code: '11' },
    { name: 'December', code: '12' },
  ];
  isEnableMessageModalVisibility: boolean = false;
  selectedMessage: AdvanceRequestMessageResponse | null = null;
  isDisableMessageModalVisibility: boolean = false;
  visibleCancelConfirmMessage: boolean = false;
  confirmSaveMessageModalVisibility: boolean = false;
  messageModalCurrentMode: 'edit' | 'add' | 'view' = 'add';
  currentMessageType: 'fixed' | 'dynamic' = 'fixed';
  isDeleteMessageModalVisibility: boolean = false;
  saveInProgress = false;
  form!: FormGroup;


  fixedMessages: AdvanceRequestMessageResponse[] = [];
  rowsTableFixedMessage: number = 10;
  firstTableFixedMessage: number = 0;
  lastTableFixedMessage = <number>4;
  totalItemsTableFixedMessage = <number>0;
  sortBy = <string>'';
  sortDirection = <string>'';
  options = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];

  headersTableFixedMessage = [
    { title: 'Description', key: 'description' },
    { title: 'Period', key: 'startDate' },
    { title: 'Status', key: 'active' },
  ];
  formFixedMessage!: FormGroup;
  fixedMessageModalVisibility: boolean = false;
  descriptionFixedMessage: string | undefined = '';
  descriptionFixedMessageFormatted!: SafeHtml;
  loadingFixedMessages = false;
  charsUsedFixed: number = 0;
  charsUsedDynamic: number = 0;
  maxLengthFixed: number = 1000;
  maxLengthDynamic: number = 1000;
  isValidEditStartDate: boolean = false;


  dynamicMessages: AdvanceRequestMessageResponse[] = [];
  rowsTableDynamicMessage: number = 10;
  firstTableDynamicMessage: number = 0;
  lastTableDynamicMessage = <number>4;
  totalItemsTableDynamicMessage = <number>0;
  sortByDynamic = <string>'';
  sortDirectionDynamic = <string>'';
  headersTableDynamicMessage = [
    { title: 'Description', key: 'description' },
    { title: 'Period', key: 'startDate' },
    { title: 'Specific Month', key: 'specificMonthId' },
    { title: 'Status', key: 'active' },
  ];
  dynamicMessageModalVisibility: boolean = false;
  formDynamicMessage!: FormGroup;
  descriptionDynamicMessage: string | undefined = '';
  descriptionDynamicMessageFormatted!: SafeHtml;
  loadingDynamicMessages = false;
  optionsDynamic = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private service: AdvanceRequestMessageService,
    public userPermissionService: UserPermissionService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.formFixedMessage = this.formBuilder.group({
      id: [null],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.formDynamicMessage = this.formBuilder.group({
      id: [null],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      specificMonthId: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.descriptionFixedMessageFormatted =
      this.sanitizer.bypassSecurityTrustHtml(this.descriptionFixedMessage || '');
    this.descriptionDynamicMessageFormatted =
      this.sanitizer.bypassSecurityTrustHtml(
        this.descriptionDynamicMessage || ''
      );
  }

  getSeverityStatusMessage(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
      default:
        return 'warning';
    }
  }

  removeTags(value: string) {
    return value.replace(/(<([^>]+)>)/gi, ' ');
  }


  openIsDeleteMessageModal(
    Message: AdvanceRequestMessageResponse,
    currentMessageType: 'fixed' | 'dynamic'
  ) {
    this.selectedMessage = Message;
    this.isDeleteMessageModalVisibility = true;
    this.currentMessageType = currentMessageType;
  }

  closeIsDeleteMessageModal() {
    this.isDeleteMessageModalVisibility = false;
    this.selectedMessage = null;
  }

  deleteMessage() {
    if (this.saveInProgress) return;

    this.saveInProgress = true;

    this.service.delete(this.selectedMessage?.id!).subscribe({
      next: (response: any) => {
        this.currentMessageType == 'fixed'
          ? this.getFixedMessages()
          : this.getDynamicMessages();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });
        this.closeIsDeleteMessageModal();
        this.saveInProgress = false;
      },
      error: (response: any) => {
        let message = 'Error deleting Message';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
        this.saveInProgress = false;
      },
    });
  }


  openIsEnableMessageModal(
    Message: AdvanceRequestMessageResponse,
    currentMessageType: 'fixed' | 'dynamic'
  ) {
    this.selectedMessage = Message;
    this.isEnableMessageModalVisibility = true;
    this.currentMessageType = currentMessageType;
  }

  closeIsEnableMessageModal() {
    this.isEnableMessageModalVisibility = false;
    this.selectedMessage = null;
  }

  enableMessage() {
    if (this.saveInProgress) return;

    this.saveInProgress = true;

    this.service.enable(this.selectedMessage?.id!).subscribe({
      next: (response: any) => {
        this.currentMessageType == 'fixed'
          ? this.getFixedMessages()
          : this.getDynamicMessages();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });
        this.closeIsEnableMessageModal();
        this.saveInProgress = false;
      },
      error: (response: any) => {
        let message = 'Error activating Message';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
        this.saveInProgress = false;
      },
    });
  }


  openIsDisableMessageModal(
    Message: AdvanceRequestMessageResponse,
    currentMessageType: 'fixed' | 'dynamic'
  ) {
    this.selectedMessage = Message;
    this.isDisableMessageModalVisibility = true;
    this.currentMessageType = currentMessageType;
  }

  closeIsDisableMessageModal() {
    this.isDisableMessageModalVisibility = false;
    this.selectedMessage = null;
  }

  disableMessage() {
    if (this.saveInProgress) return;

    this.saveInProgress = true;

    this.service.disable(this.selectedMessage?.id!).subscribe({
      next: (response: any) => {
        this.currentMessageType == 'fixed'
          ? this.getFixedMessages()
          : this.getDynamicMessages();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });
        this.closeIsDisableMessageModal();
        this.saveInProgress = false;
      },
      error: (response: any) => {
        let message = 'Error deactivating Message';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
        this.saveInProgress = false;
      },
    });
  }


  openCancelConfirmMessageModal() {
    this.visibleCancelConfirmMessage = true;
  }

  closeCancelConfirmMessageModal() {
    this.visibleCancelConfirmMessage = false;
    this.isValidEditDataInicio = false;
  }


  openConfirmSaveMessageModal(type?: 'fixed') {
    const isValidForm = type
      ? this.formFixedMessage.valid
      : this.formDynamicMessage.valid;
    this.form = type ? this.formFixedMessage : this.formDynamicMessage;

    this.form.markAllAsTouched();
    if (!isValidForm) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields.',
      });
      this.closeConfirmSaveMessageModal();
      return;
    }


    const startDateValue = this.form.value.startDate;
    if (startDateValue) {
      const startDate = new Date(startDateValue);
      const dataHoje = new Date();
      startDate.setHours(0, 0, 0, 0);
      dataHoje.setHours(0, 0, 0, 0);
    }

    if (
      (this.form.value.startDate && !this.form.value.endDate) ||
      (!this.form.value.startDate && this.form.value.endDate)
    ) {
      this.messageService.add({
        life: 5000,
        severity: 'error',
        summary: 'Error',
        detail:
          'When a deadline exists for registration, both fields must be filled. \n Fields: Start Date and End Date.',
      });
      this.closeConfirmSaveMessageModal();
      return;
    }

    if (this.form?.value?.startDate && this.form?.value?.endDate) {
      const startDate = new Date(this.form.value.startDate);
      const endDate = new Date(this.form.value.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      if (endDate.getTime() <= startDate.getTime()) {
        this.messageService.add({
          life: 5000,
          severity: 'error',
          summary: 'Error',
          detail:
            'The Message cannot be added/edited because the end date must be greater than the start date. Please change the start or end date.',
        });
        this.closeConfirmSaveMessageModal();
        return;
      }
    }

    if (this.selectedMessage?.id) {
      if (this.isValidEditDataInicio) {
        const startDate = new Date(this.form.value.startDate);
        const dataHoje = new Date();

        startDate.setHours(0, 0, 0, 0);
        dataHoje.setHours(0, 0, 0, 0);
        if (startDate.getTime() < dataHoje.getTime()) {
          this.messageService.add({
            life: 5000,
            severity: 'error',
            summary: 'Error',
            detail:
              'The Message cannot be added/edited because the start date must be equal to or greater than the current date. Please change the start date.',
          });
          this.closeConfirmSaveMessageModal();
          return;
        }
      }
    } else {
      if (this.form?.value?.startDate && this.form?.value?.endDate) {
        const startDate = new Date(this.form.value.startDate);
        const dataHoje = new Date();

        startDate.setHours(0, 0, 0, 0);
        dataHoje.setHours(0, 0, 0, 0);
        if (startDate.getTime() < dataHoje.getTime()) {
          this.messageService.add({
            life: 5000,
            severity: 'error',
            summary: 'Error',
            detail:
              'The Message cannot be added/edited because the start date must be equal to or greater than the current date. Please change the start date.',
          });
          this.closeConfirmSaveMessageModal();
          return;
        }
      }
    }
    this.confirmSaveMessageModalVisibility = true;
  }

  closeConfirmSaveMessageModal() {
    this.confirmSaveMessageModalVisibility = false;
  }


  onRowsChangeMessageFixed(newRows: number): void {
    this.rowsTableFixedMessage = newRows;
    this.firstTableFixedMessage = 0;
    this.getFixedMessages();
  }

  getFixedMessages(event?: any) {
    if (this.loadingFixedMessages) return;

    this.loadingFixedMessages = true;

    const payload: any = {
      skip: 0,
      take: this.rowsTableFixedMessage,
      IdTypeMessage: 1,
    };

    if (event?.page) {
      payload.skip = event?.page * this.rowsTableFixedMessage;
      payload.take = this.rowsTableFixedMessage;
      if (this.sortBy) {
        payload.sortBy = this.sortBy;
        payload.sortDirection = this.sortDirection;
      }
    }

    if (payload.skip === 0 && this.sortBy) {
      payload.sortBy = this.sortBy;
      payload.sortDirection = this.sortDirection;
    }

    if (event?.sortField) {
      const field = event.sortField;
      if (!this.sortStates[field]) {
        this.sortStates[field] = 1;
      } else if (this.sortStates[field] === 1) {
        this.sortStates[field] = -1;
      } else {
        this.sortStates[field] = 0;
      }


      for (let key in this.sortStates) {
        if (key !== field) this.sortStates[key] = 0;
      }

      if (this.sortStates[field] === 1) {
        this.sortBy = field;
        this.sortDirection = field == 'ativo' ? 'Descending' : 'Ascending';
        payload.sortBy = this.sortBy;
        payload.sortDirection = this.sortDirection;
      } else if (this.sortStates[field] === -1) {
        this.sortBy = field;
        this.sortDirection = field == 'ativo' ? 'Ascending' : 'Descending';
        payload.sortBy = this.sortBy;
        payload.sortDirection = this.sortDirection;
      } else {

        this.sortBy = '';
        this.sortDirection = '';
        delete payload.sortBy;
        delete payload.sortDirection;
        this.tb.reset();
      }
    } else {
      if (this.sortBy) {
        payload.sortBy = this.sortBy;
        payload.sortDirection = this.sortDirection;
      }
    }

    this.firstTableFixedMessage =
      event?.first || this.firstTableFixedMessage || 0;
    this.rowsTableFixedMessage =
      event?.rows || this.rowsTableFixedMessage || 10;

    this.service.getMessagePaged(payload).subscribe({
      next: (response: any) => {
        this.fixedMessages = response.data;

        this.totalItemsTableFixedMessage = response.totalElements;
        this.firstTableFixedMessage = event?.first || 0;
        this.lastTableFixedMessage = Math.min(
          this.firstTableFixedMessage + this.rowsTableFixedMessage,
          this.totalItemsTableFixedMessage
        );
        this.loadingFixedMessages = false;
      },
      error: (response: any) => {
        this.loadingFixedMessages = false;
      },
    });

    this.firstTableFixedMessage =
      event?.first || this.firstTableFixedMessage || 0;
  }

  getTitleMessageFixedModal() {
    let title = 'View';

    if (this.messageModalCurrentMode == 'add') title = 'Add';
    else if (this.messageModalCurrentMode == 'edit') title = 'Edit';

    return title + ' Fixed Message';
  }


  openFixedMessageModal(
    mode: 'edit' | 'add' | 'view',
    fixedMessage: AdvanceRequestMessageResponse | null
  ) {
    this.currentMessageType = 'fixed';
    this.formFixedMessage.reset();
    this.descriptionFixedMessage = '';
    this.formFixedMessage.enable();
    this.messageModalCurrentMode = mode;
    if (mode === 'add' || !fixedMessage) {
      this.fixedMessageModalVisibility = true;
      return;
    }
    this.selectedMessage = fixedMessage;

    if (mode === 'edit' || mode === 'view') {
      this.formFixedMessage.get('id')?.setValue(fixedMessage.id);
      this.descriptionFixedMessage = fixedMessage.description;
      this.descriptionFixedMessageFormatted =
        this.sanitizer.bypassSecurityTrustHtml(
          this.descriptionFixedMessage || ''
        );
      this.charsUsedFixed =
        this.removeDescriptionTags(this.descriptionFixedMessage || '').length < 1000
          ? this.removeDescriptionTags(this.descriptionFixedMessage || '').length
          : 1000;

      this.formFixedMessage
        .get('startDate')
        ?.setValue(this.addDays(new Date(fixedMessage?.startDate!), 1));
      this.formFixedMessage
        .get('endDate')
        ?.setValue(this.addDays(new Date(fixedMessage?.endDate!), 1));
      this.form = this.formFixedMessage;

      if (mode === 'view') this.formFixedMessage.disable();
    }

    this.fixedMessageModalVisibility = true;

    setTimeout(() => {
      if (fixedMessage?.description) {
        this.formFixedMessage
          .get('description')
          ?.setValue(fixedMessage.description);
      }
    }, 0);
  }

  closeFixedMessageModal() {
    this.fixedMessageModalVisibility = false;
    this.formFixedMessage.reset();
    this.selectedMessage = null;
    this.descriptionFixedMessage = '';
    this.isValidEditDataInicio = false;
  }


  saveOrEditFixedMessage() {
    const edit = this.formFixedMessage.get('id')?.value;

    const payload = this.formFixedMessage.value;
    if (payload.startDate)
      payload.startDate = this.formatDateToApi(payload.startDate);
    else payload.startDate = null;

    if (payload.endDate)
      payload.endDate = this.formatDateToApi(payload.endDate);
    else payload.endDate = null;

    payload.description = this.descriptionFixedMessage;
    edit ? this.fixedMessageEdit(payload) : this.fixedMessageSave(payload);
  }

  fixedMessageEdit(payload: AdvanceMessage) {
    if (this.saveInProgress) return;

    this.saveInProgress = true;

    this.service.updateFixedMessage(payload).subscribe({
      next: (response: any) => {
        this.getFixedMessages();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });

        this.closeConfirmSaveMessageModal();
        this.closeFixedMessageModal();
        this.saveInProgress = false;
      },
      error: (response: any) => {
        let message = 'Error editing Fixed Message';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.closeConfirmSaveMessageModal();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
        this.saveInProgress = false;
      },
    });
  }

  fixedMessageSave(payload: AdvanceMessage) {
    if (this.saveInProgress) return;

    this.saveInProgress = true;

    this.service.insertFixedMessage(payload).subscribe({
      next: (response: any) => {
        this.getFixedMessages();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });

        this.closeConfirmSaveMessageModal();
        this.closeFixedMessageModal();
        this.saveInProgress = false;
      },
      error: (response: any) => {
        let message = 'Error registering Fixed Message';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.closeConfirmSaveMessageModal();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
        this.saveInProgress = false;
      },
    });
  }


  onRowsChangeDynamicMessage(newRows: number): void {
    this.rowsTableDynamicMessage = newRows;
    this.firstTableDynamicMessage = 0;
    this.getDynamicMessages();
  }

  getDynamicMessages(event?: any) {
    if (this.loadingDynamicMessages) return;

    this.loadingDynamicMessages = true;

    const payload: any = {
      skip: 0,
      take: this.rowsTableDynamicMessage,
      IdTypeMessage: 2,
    };

    if (event?.page) {
      payload.skip = event?.page * this.rowsTableDynamicMessage;
      payload.take = this.rowsTableDynamicMessage;
      if (this.sortByDynamic) {
        payload.sortBy = this.sortByDynamic;
        payload.sortDirection = this.sortDirectionDynamic;
      }
    }

    if (payload.skip === 0 && this.sortByDynamic) {
      payload.sortBy = this.sortByDynamic;
      payload.sortDirection = this.sortDirectionDynamic;
    }

    if (event?.sortField) {
      const field = event.sortField;
      if (!this.sortStates[field]) {
        this.sortStates[field] = 1;
      } else if (this.sortStates[field] === 1) {
        this.sortStates[field] = -1;
      } else {
        this.sortStates[field] = 0;
      }


      for (let key in this.sortStates) {
        if (key !== field) this.sortStates[key] = 0;
      }

      if (this.sortStates[field] === 1) {
        this.sortByDynamic = field;
        this.sortDirectionDynamic =
          field == 'ativo' ? 'Descending' : 'Ascending';
        payload.sortBy = this.sortByDynamic;
        payload.sortDirection = this.sortDirectionDynamic;
      } else if (this.sortStates[field] === -1) {
        this.sortByDynamic = field;
        this.sortDirectionDynamic =
          field == 'ativo' ? 'Ascending' : 'Descending';
        payload.sortBy = this.sortByDynamic;
        payload.sortDirection = this.sortDirectionDynamic;
      } else {

        this.sortByDynamic = '';
        this.sortDirectionDynamic = '';
        delete payload.sortBy;
        delete payload.sortDirection;
        this.tb2.reset();
      }
    } else {
      if (this.sortByDynamic) {
        payload.sortBy = this.sortByDynamic;
        payload.sortDirection = this.sortDirectionDynamic;
      }
    }

    this.firstTableDynamicMessage =
      event?.first || this.firstTableDynamicMessage || 0;
    this.rowsTableDynamicMessage =
      event?.rows || this.rowsTableDynamicMessage || 10;

    this.service.getMessagePaged(payload).subscribe({
      next: (response: any) => {
        this.dynamicMessages = response.data;

        this.totalItemsTableDynamicMessage = response.totalElements;
        this.firstTableDynamicMessage = event?.first || 0;
        this.lastTableDynamicMessage = Math.min(
          this.firstTableDynamicMessage + this.rowsTableDynamicMessage,
          this.totalItemsTableDynamicMessage
        );
        this.loadingDynamicMessages = false;
      },
      error: (response: any) => {
        this.loadingDynamicMessages = false;
      },
    });

    this.firstTableDynamicMessage =
      event?.first || this.firstTableDynamicMessage || 0;
  }

  getTitleMessageDynamicModal() {
    let title = 'View';

    if (this.messageModalCurrentMode == 'add') title = 'Add';
    else if (this.messageModalCurrentMode == 'edit') title = 'Edit';

    return title + ' Message Dynamic';
  }


  openDynamicMessageModal(
    mode: 'edit' | 'add' | 'view',
    dynamicMessage: AdvanceRequestMessageResponse | null
  ) {
    this.currentMessageType = 'dynamic';
    this.formDynamicMessage.reset();
    this.descriptionDynamicMessage = '';
    this.formDynamicMessage.enable();
    this.messageModalCurrentMode = mode;
    if (mode === 'add' || !dynamicMessage) {
      this.dynamicMessageModalVisibility = true;
      return;
    }
    this.selectedMessage = dynamicMessage;

    if (mode === 'edit' || mode === 'view') {
      this.formDynamicMessage.get('id')?.setValue(dynamicMessage.id);
      this.descriptionDynamicMessage = dynamicMessage.description;
      this.descriptionDynamicMessageFormatted =
        this.sanitizer.bypassSecurityTrustHtml(
          this.descriptionDynamicMessage || ''
        );
      this.charsUsedDynamic =
        this.removeDescriptionTags(this.descriptionDynamicMessage || '').length <
        1000
          ? this.removeDescriptionTags(this.descriptionDynamicMessage || '')
              .length
          : 1000;

      this.formDynamicMessage
        .get('startDate')
        ?.setValue(this.addDays(new Date(dynamicMessage?.startDate!), 1));
      this.formDynamicMessage
        .get('endDate')
        ?.setValue(this.addDays(new Date(dynamicMessage?.endDate!), 1));
      this.formDynamicMessage
        .get('specificMonthId')
        ?.setValue(
          this.months.find(
            (m: any) => m.code == dynamicMessage?.specificMonthId!.toString()
          )
        );
      this.form = this.formDynamicMessage;

      if (mode === 'view') this.formDynamicMessage.disable();
    }

    this.dynamicMessageModalVisibility = true;

    setTimeout(() => {
      if (dynamicMessage?.description) {
        this.formDynamicMessage
          .get('description')
          ?.setValue(dynamicMessage.description);
      }
    }, 0);
  }

  closeDynamicMessageModal() {
    this.dynamicMessageModalVisibility = false;
    this.formDynamicMessage.reset();
    this.selectedMessage = null;
    this.descriptionDynamicMessage = '';
    this.isValidEditDataInicio = false;
  }


  saveOrEditDynamicMessage() {
    const edit = this.formDynamicMessage.get('id')?.value;

    const payload = this.formDynamicMessage.value;
    if (payload.startDate)
      payload.startDate = this.formatDateToApi(payload.startDate);
    else payload.startDate = null;

    if (payload.endDate)
      payload.endDate = this.formatDateToApi(payload.endDate);
    else payload.endDate = null;

    payload.description = this.descriptionDynamicMessage;
    if (payload.specificMonthId)
      payload.specificMonthId = +payload.specificMonthId.code;
    else payload.specificMonthId = null;

    edit
      ? this.dynamicMessageEdit(payload)
      : this.dynamicMessageSave(payload);
  }

  dynamicMessageEdit(payload: AdvanceMessage) {
    if (this.saveInProgress) return;

    this.saveInProgress = true;

    this.service.updateDynamicMessage(payload).subscribe({
      next: (response: any) => {
        this.getDynamicMessages();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });

        this.closeConfirmSaveMessageModal();
        this.closeDynamicMessageModal();
        this.saveInProgress = false;
      },
      error: (response: any) => {
        let message = 'Error editing Dynamic Message';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.closeConfirmSaveMessageModal();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
        this.saveInProgress = false;
      },
    });
  }

  dynamicMessageSave(payload: AdvanceMessage) {
    if (this.saveInProgress) return;

    this.saveInProgress = true;

    this.service.insertDynamicMessage(payload).subscribe({
      next: (response: any) => {
        this.getDynamicMessages();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });

        this.closeConfirmSaveMessageModal();
        this.closeDynamicMessageModal();
        this.saveInProgress = false;
      },
      error: (response: any) => {
        let message = 'Error registering Dynamic Message';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.closeConfirmSaveMessageModal();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
        this.saveInProgress = false;
      },
    });
  }


  private addDays(date: Date, days: number) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  private formatDateToApi(date: any) {
    if (!date) {
      return null;
    }

    if (typeof date === 'string' || typeof date === 'number') {
      date = new Date(date);
    }
    if (typeof date.getDate !== 'function') {
      return null;
    }
    let day = date.getDate();
    if (day < 10) day = `0${day}`;

    let month = date.getMonth() + 1;
    if (month < 10) month = `0${month}`;

    return `${date.getFullYear()}-${month}-${day}`;
  }

  onDateInputMask(event: any): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    if (value.length >= 5) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    event.target.value = value;
  }

  limitCharacterCountEditor(
    event: EditorTextChangeEvent,
    editorRef: Editor,
    maxLength: number,
    counterProperty:
      | 'charsUsedFixed'
      | 'charsUsedDynamic'
  ) {
    const quill: Quill = editorRef?.quill;
    if (!quill) {
      return;
    }

    const plainText = event.textValue || '';

    if (plainText.length > maxLength) {
      const excessLength = plainText.length - maxLength;
      quill.deleteText(maxLength, excessLength);
      this[counterProperty] = maxLength;
      this.editorCharacterLimitExceeded = true;
    } else {
      this[counterProperty] = plainText.length;
      this.editorCharacterLimitExceeded = false;
    }
    if (editorRef === this.editorRefDynamic) {
      this.descriptionDynamicMessage = quill.root.innerHTML;
    } else {
      this.descriptionFixedMessage = quill.root.innerHTML;
    }
    this.cdr.detectChanges();
  }

  removeDescriptionTags(html: string): string {
    if (!html) return '';

    const div = document.createElement('div');
    div.innerHTML = html;

    const extractText = (node: Node): string => {
      let text = '';

      node.childNodes.forEach((child: any) => {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const tag = (child as HTMLElement).tagName.toLowerCase();

          text += extractText(child);

          if (['p', 'div', 'br', 'li', 'tr'].includes(tag)) {
            text += '\n';
          }
        }
      });

      return text;
    };
    return extractText(div).trim();
  }

  onChangeStartDate(event: Date) {
    if (this.form?.value?.startDate && this.form?.value?.endDate) {
      const startDate = new Date(this.form.value.startDate);
      const dataHoje = new Date();

      startDate.setHours(0, 0, 0, 0);
      dataHoje.setHours(0, 0, 0, 0);
      if (startDate.getTime() < dataHoje.getTime()) {
        this.isValidEditDataInicio = true;
        return;
      }
    } else {
      this.isValidEditDataInicio = false;
    }
  }
  private configureEditor(editor: Editor): void {
    const checkQuill = setInterval(() => {
      const quill = editor?.quill;
      if (!quill) return;

      clearInterval(checkQuill);


      quill.root.addEventListener(
        'paste',
        (e: { preventDefault: () => void }) => {
          e.preventDefault();
        }
      );


      quill.root.addEventListener(
        'contextmenu',
        (e: { preventDefault: () => void }) => {
          e.preventDefault();
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Right-click menu is disabled in this field.',
          });
        }
      );


      quill.on('text-change', (_delta: any, _oldDelta: any, source: string) => {
        if (source === 'user') {
          const imgs = quill.root.querySelectorAll('img');
          if (imgs.length > 0) {
            imgs.forEach((img: { remove: () => any }) => img.remove());
            this.messageService.add({
              severity: 'warn',
              summary: 'Warning',
              detail: 'Images are not allowed.',
            });
          }
        }
      });
    }, 100);
  }

  ngAfterViewInit(): void {
    this.configureEditor(this.editorRef);
    this.configureEditor(this.editorRefDynamic);
  }
}
