import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { IconCloseSquareComponent } from '../../components/icons/icon-close-square/icon-close-square.component';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IconAddSquareComponent } from '../../components/icons/icon-add-square/icon-add-square.component';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { UserPermissionService } from '../../services/user-permission.service';
import { SidebarService } from '../../services/sidebar.service';
import { IconSearchNormalComponent } from '../../components/icons/icon-search-normal/icon-search-normal.component';
import { IconCleanComponent } from '../../components/icons/icon-clean/icon-clean.component';
import { CalendarModule } from 'primeng/calendar';
import { IconCalendarComponent } from '../../components/icons/icon-calendar/icon-calendar.component';
import {
  GetAdvanceRequestsPayload,
  AdvanceRequestsService,
} from '../../services/advance-requests.service';
import { IconViewComponent } from '../../components/icons/icon-view/icon-view.component';
import { IconEdit2Component } from '../../components/icons/icon-edit2/icon-edit2.component';
import { IconSaveComponent } from '../../components/icons/icon-save/icon-save.component';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ExpenseTypeService } from '../../services/expense-type.service';
import { AdvanceRequestMessageService } from '../../services/advance-request-message.service';
import { Month } from '../../models/Month';
import { UserResponse } from '../../models/response/UserResponse';
import { DropdownSelect } from '../../models/DropdownSelect';
import { AddEditAdvanceRequestComponent } from '../../components/dialogs/add-edit-advance-request/add-edit-advance-request.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-advance-request',
  standalone: true,
  imports: [
    ToastModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    CardModule,
    TableModule,
    DialogModule,
    IconCloseSquareComponent,
    Button,
    InputTextModule,
    CheckboxModule,
    IconFieldModule,
    InputIconModule,
    IconAddSquareComponent,
    PaginatorModule,
    TooltipModule,
    IconSearchNormalComponent,
    IconCleanComponent,
    IconCalendarComponent,
    IconViewComponent,
    IconEdit2Component,
    IconSaveComponent,
    AddEditAdvanceRequestComponent,
    PaginatorComponent,
    DropdownModule,
  ],
  providers: [MessageService],
  templateUrl: './advance-request.component.html',
  styleUrl: './advance-request.component.scss',
})
export class AdvanceRequestComponent implements OnInit {
  [x: string]: any;
  sortStates: { [key: string]: number } = {};
  @ViewChild('tb') tb!: Table;

  formSearch: FormGroup;
  searchInProgress = false;
  currentUser: any;
  isVisibleNewModalMonthly: boolean = false;
  isVisibleEditModalMonthly: boolean = false;
  isVisibleViewModalMonthly: boolean = false;
  isVisibleNewModalOccasional: boolean = false;
  isVisibleConfirmChoice: boolean = false;
  isEditDisabled = true;
  visibleCancelConfirm: boolean = false;
  visibleSaveConfirm: boolean = false;
  isValid: boolean = false;
  newMonthSelected: boolean = false;
  confirmLabel: string = '';

  first = <number>0;
  last = <number>4;
  rows = <number>10;
  totalItems = <number>0;
  sortBy = <string>'';
  sortDirection = <string>'';
  options = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];

  date1: Date | undefined;
  dateToday = new Date();
  currentYear: any;
  yearPayload: any;
  advanceRequests: any[] = [];
  advanceRequestDetail: any = null;
  unitDescription: string = '';
  requestMessageFormatted!: SafeHtml;
  newRequest: any = null;
  newRequestFormatted!: SafeHtml;
  requestToSave: any = {};
  advanceRequestId: number = 0;
  requestTypeOptions: DropdownSelect[] = [];

  minYear: Date;
  maxYear: Date;

  isVisibleFrank: boolean = true;

  private paramsSearchAdvanceRequestsDefault: GetAdvanceRequestsPayload = {
    searchTerm: '',
    page: 1,
    pageSize: 10,
    sortColumn: 'Name',
    sortDirection: 'ASC',
  } as GetAdvanceRequestsPayload;
  paramsSearchAdvanceRequests: GetAdvanceRequestsPayload =
    this.paramsSearchAdvanceRequestsDefault;
  loadingGridData = true;
  requestMonthsEdit: any[] = [];
  requestMonthsNew: any[] = [];
  requestMessage: any = undefined;
  checkboxesSelected: string[] = [];
  messagesByMonth: { [idMonth: number]: any } = {};
  selectedMonths: number[] = [];

  constructor(
    public userPermissionService: UserPermissionService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private advanceRequestsService: AdvanceRequestsService,
    private expenseTypeService: ExpenseTypeService,
    private advanceRequestMessageService: AdvanceRequestMessageService,
    private sanitizer: DomSanitizer,
    public sidebarService: SidebarService,
  ) {
    this.formSearch = this.formBuilder.group({
      searchTerm: [''],
      budgetTypeId: null,
      year: null,
    });
    this.currentYear = new Date().getFullYear();
    this.yearPayload = this.currentYear;
    this.getTypes();
    this.currentUser = this.userPermissionService.getCurrentUser();

    this.minYear = new Date(this.currentYear - 10, 0, 1);
    this.maxYear = new Date(this.currentYear + 30, 11, 31);

    this.requestMessageFormatted = this.sanitizer.bypassSecurityTrustHtml('');
    this.newRequestFormatted = this.sanitizer.bypassSecurityTrustHtml('');
    this.dynamicMessageFormatted = this.sanitizer.bypassSecurityTrustHtml('');
  }

  ngOnInit(): void {
    this.getAdvanceRequests();
    this.formSearch.get('requestYear')?.valueChanges.subscribe((value) => {
      this.onYearChange(value);
    });
  }


  getTypes() {
    this.expenseTypeService.getType().subscribe({
      next: (response) => {
        const types = Array.isArray(response) ? response : [];
        this.requestTypeOptions = [{ id: 0, description: 'All' }, ...types];
      },
      error: () => {
        this.requestTypeOptions = [{ id: 0, description: 'All' }];
      },
    });
  }

  onRowsChange(newRows: number): void {
    this.rows = newRows;
    this.first = 0;
    this.getAdvanceRequests();
  }

  getAdvanceRequests(event?: any) {
    if (this.searchInProgress) return;

    this.searchInProgress = true;

    const payload: any = {
      skip: 0,
      take: this.rows,
      requestYear: this.yearPayload,
      searchString: this.formSearch.value.searchTerm || '',
      ...(this.formSearch.value.budgetTypeId && {
        budgetTypeId: this.formSearch.value.budgetTypeId,
      }),
    };

    if (event?.page) {
      payload.skip = event?.page * this.rows;
      payload.take = this.rows;
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
        this.sortDirection = 'Ascending';
        payload.sortBy = this.sortBy;
        payload.sortDirection = this.sortDirection;
      } else if (this.sortStates[field] === -1) {
        this.sortBy = field;
        this.sortDirection = 'Descending';
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

    this.first = event?.first || this.first || 0;
    this.rows = event?.rows || this.rows || 10;

    this.advanceRequestsService.getAdvancedRequestsPaged(payload).subscribe({
      next: (response) => {
        this.advanceRequests = Array.isArray(response) ? response : (response?.data ?? []);
        this.totalItems = Array.isArray(response) ? response.length : (response?.totalElements ?? 0);
        this.first = event?.first || 0;
        this.last = Math.min(this.first + this.rows, this.totalItems);
        this.searchInProgress = false;
      },
      error: (response) => {
        this.searchInProgress = false;
      },
    });
    this.first = event?.first || this.first || 0;
  }

  searchRequestByKeyword() {
    this.getAdvanceRequests();
  }

  validateStartRegistration() {
    this.advanceRequestsService.getValidationStartProcess().subscribe({
      next: (response) => {
        this.isValid = response;
        if (this.isValid === true) {
          this.showConfirmChoice();
        }
      },
      error: (response) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error?.errors[0],
        });
      },
    });
  }

  isValidRegistrationRequestMonthly() {
    this.advanceRequestsService.getValidationMonthlyRequest().subscribe({
      next: (response) => {
        this.isVisibleConfirmChoice = false;

        this.newRequest = response;
        this.newRequestFormatted = this.sanitizer.bypassSecurityTrustHtml(
          this.newRequest?.message ?? '',
        );

        this.requestMonthsNew = (this.newRequest?.months ?? []).map(
          (month: Month) => ({
            monthId: month.monthId,
            description: month.description,
            requested: month.requested,
            isFieldDisabled: month.isFieldDisabled,
          }),
        );
        this.showNewRequestModal();
      },
      error: (response) => {
        this.isVisibleConfirmChoice = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error?.errors[0],
        });
      },
    });
  }

  searchClean() {
    this.formSearch.reset();
    this.yearPayload = this.currentYear;
    this.getAdvanceRequests();
  }

  saveNewRequest() {
    const selectedMonths = this.requestMonthsNew;

    const requestPayload = {
      months: selectedMonths,
    };

    this.advanceRequestsService.insert(requestPayload).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Request created successfully.',
        });
        this.visibleSaveConfirm = false;
        this.isVisibleNewModalMonthly = false;
        this.getAdvanceRequests();
      },
      error: (response) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error?.errors[0],
        });
        this.visibleSaveConfirm = false;
      },
    });
  }

  saveEditRequest() {
    const hasValidMonth = this.requestMonthsEdit.find(
      (m: any) => m.requested == true,
    );
    if (!hasValidMonth) {
      {
        this.messageService.add({
          life: 5000,
          severity: 'error',
          summary: 'Error',
          detail:
            'At least one month must be selected to create the monthly advance request.',
        });
        this.visibleSaveConfirm = false;
        return;
      }
    }

    const selectedMonths = this.requestMonthsEdit;

    const requestPayload = {
      months: selectedMonths,
    };

    this.advanceRequestsService
      .update(this.advanceRequestId, requestPayload)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Request edited successfully.',
          });
          this.visibleSaveConfirm = false;
          this.isVisibleEditModalMonthly = false;
          this.getAdvanceRequests();
        },
        error: (response) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.error?.errors[0],
          });
          this.isVisibleEditModalMonthly = false;
          this.visibleSaveConfirm = false;
        },
      });
  }

  showNewRequestModal() {
    this.isVisibleNewModalMonthly = true;
  }

  showEditModal() {
    this.isVisibleEditModalMonthly = true;
  }

  showViewModal() {
    this.isVisibleViewModalMonthly = true;
  }

  closeModalAdd() {
    this.dynamicMessage = undefined;
    this.isVisibleNewModalMonthly = false;
  }

  closeModalEdit() {
    this.dynamicMessage = undefined;
    this.isVisibleEditModalMonthly = false;
  }

  closeMessageModal() {
    this.dynamicMessage = undefined;
  }

  showConfirmChoice() {
    this.isVisibleConfirmChoice = true;
  }

  confirmSave(label: string) {
    this.confirmLabel = label;
    this.visibleSaveConfirm = true;
  }

  confirmCancel(label: string) {
    this.confirmLabel = label;
    this.visibleCancelConfirm = true;
  }

  closeCancel(label: string) {
    switch (label) {
      case 'Add':
        return this.closeModalAdd();
      case 'Edit':
        return this.closeModalEdit();
    }
  }

  onYearChange(event: any) {
    if (event instanceof Date) {
      this.yearPayload = event.getFullYear();
    } else if (typeof event === 'string') {
      const parsed = new Date(event);
      if (!isNaN(parsed.getTime())) {
        this.yearPayload = parsed.getFullYear();
      }
    } else {
      this.yearPayload = null;
    }
  }

  getAdvanceRequestById(id: number) {
    this.advanceRequestId = id;
    this.advanceRequestsService.getAdvanceRequestById(id).subscribe({
      next: (response) => {
        this.advanceRequestDetail = response;
        this.unitDescription =
          this.advanceRequestDetail?.unitDescription ?? '-';
        this.requestMessageFormatted = this.sanitizer.bypassSecurityTrustHtml(
          this.advanceRequestDetail?.message ?? '',
        );

        this.requestMonthsEdit = (this.advanceRequestDetail?.months ?? []).map(
          (month: Month) => ({
            monthId: month.monthId,
            description: month.description,
            requested: month.requested,
            isFieldDisabled: month.isFieldDisabled,
          }),
        );

        const MessageMonthId = this.requestMonthsEdit.find(
          (a: any) => a.monthId,
        );
        if (isNaN(MessageMonthId)) {
          return 'Not a Number';
        } else {
          return this.getDynamicMessage(MessageMonthId);
        }
      },
      error: (response) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error?.errors[0],
        });
      },
    });
  }

  onCheckboxChange(month: Month): void {
    if (month.requested) {
      this.getDynamicMessage(month.monthId as number);
    } else {
      this.dynamicMessage = undefined;
    }
  }

  getDynamicMessage(monthId: number): void {
    this.advanceRequestMessageService
      .getDynamicMessagesByMonth(monthId)
      .subscribe({
        next: (response) => {
          this.messagesByMonth[monthId] = response;
          const message = Array.isArray(response)
            ? (response[0] ?? null)
            : (response?.data?.[0] ?? response);
          if (!message) {
            this.dynamicMessage = undefined;
            this.dynamicMessageFormatted = this.sanitizer.bypassSecurityTrustHtml('');
            return;
          }
          this.dynamicMessage = message;
          this.dynamicMessageFormatted = this.sanitizer.bypassSecurityTrustHtml(
            message?.description ?? '',
          );
        },
        error: (response) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.error?.errors[0],
          });
        },
      });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key)) {
      event.preventDefault();
    }
  }

  limitYearLength(event: any) {
    const input = event.target;
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
  }
}
