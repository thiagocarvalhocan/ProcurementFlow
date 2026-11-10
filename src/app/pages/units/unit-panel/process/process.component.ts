import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { PaginatorModule } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { IconAddSquareComponent } from '../../../../components/icons/icon-add-square/icon-add-square.component';
import { IconCloseSquareComponent } from '../../../../components/icons/icon-close-square/icon-close-square.component';
import { IconSaveComponent } from '../../../../components/icons/icon-save/icon-save.component';
import { IconViewComponent } from '../../../../components/icons/icon-view/icon-view.component';
import { IconEdit2Component } from '../../../../components/icons/icon-edit2/icon-edit2.component';
import { IconSearchNormalComponent } from '../../../../components/icons/icon-search-normal/icon-search-normal.component';
import { IconCleanComponent } from '../../../../components/icons/icon-clean/icon-clean.component';
import { UserPermissionService } from '../../../../services/user-permission.service';
import { AdvanceRequestsService } from '../../../../services/advance-requests.service';
import { DividerModule } from 'primeng/divider';
import { ProcessService } from '../../../../services/process.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseTypeService } from '../../../../services/expense-type.service';
import { InputTextModule } from 'primeng/inputtext';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { provideNgxMask } from 'ngx-mask';
import { TooltipModule } from 'primeng/tooltip';
import { IconCalendarComponent } from '../../../../components/icons/icon-calendar/icon-calendar.component';
import { MonthlyAdvanceRequestStatusService } from '../../../../services/monthly-advance-request-status.service';
import { UserService } from '../../../../services/user.service';
import { ProcessNumberPipe } from '../../../../pipes/process-number.pipe';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { UserResponse } from '../../../../models/response/UserResponse';
import { AdvanceRequestViewComponent } from '../../../../components/dialogs/advance-request-view/advance-request-view.component';
import { Month } from '../../../../models/Month';
import { MainProcess } from '../../../../models/response/MainProcess';
import { AdvanceRequestMonth } from '../../../../models/AdvanceRequestMonth';
import { DropdownSelect } from '../../../../models/DropdownSelect';
import { ProcessSearch } from '../../../../models/ProcessSearch';
import { MainProcessPayload } from '../../../../models/MainProcessPayload';
import { AdvanceRequest } from '../../../../models/AdvanceRequest';
import { RequestsSearchPayload } from '../../../../models/RequestsSearchPayload';
import { SearchTablePayload } from '../../../../models/SearchTablePayload';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { AuthenticatedUser } from '../../../../core/auth/models/authenticated-user';
import { Accountant } from '../../../../models/Accountant';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    CardModule,
    DividerModule,
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
    PaginatorModule,
    IconSearchNormalComponent,
    IconCleanComponent,
    InputTextModule,
    InputTextareaModule,
    CurrencyMaskModule,
    TooltipModule,
    AutoCompleteModule,
    IconCalendarComponent,
    ProcessNumberPipe,
    AdvanceRequestViewComponent,
    PaginatorComponent,
  ],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss',
  providers: [MessageService, provideNgxMask()],
})
export class ProcessComponent {
  sortStates: { [key: string]: number } = {};
  @ViewChild('tb') tb!: Table;
  sortStatesRequest: { [key: string]: number } = {};
  @ViewChild('tbRequest') tbRequest!: Table;

  mode: 'view' | 'edit' | 'new' = 'new';
  yearPayload?: number;
  currentYear?: number;
  idUnitCurrent: number | null = null;

  searchInProgress: boolean = false;
  isVisibleCancelConfirm: boolean = false;
  isVisibleConfirmSaveModal: boolean = false;
  modalCurrentMode: 'edit' | 'add' | 'view' = 'add';

  mainProcesses: MainProcess[] = [];
  processSelected: MainProcess[] = [];
  processSelectedView: MainProcess | undefined;
  rowsTableProcessMain = <number>10;
  firstTableProcessMain = <number>0;
  lastTableProcessMain = <number>4;
  totalItemsProcessMain = <number>0;
  sortByProcess? = <string>'';
  sortDirectionProcess? = <string>'';
  optionsProcessMain = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];

  headersTableProcessMain = [
    { title: 'Process', key: 'processNumber' },
    { title: 'Period', key: 'startDate' },
    { title: 'Monthly Budget', key: 'valueBudget' },
    { title: 'Defalcation', key: 'defalcation' },
    { title: 'Change Ownership', key: 'changeOwnership' },
    { title: 'Two Opened', key: 'twoOpened' },
    { title: 'Status', key: 'descriptionStatusProcess' },
  ];
  formMainProcess!: FormGroup;
  isVisibleModalProcessMain: boolean = false;
  isVisibleModalViewRequestProcessMain: boolean = false;
  isReasonVisible: boolean = false;
  isReasonStatusVisible: boolean = false;
  descriptionProcessMain = '';
  months: Month[] = [];

  // Table
  advanceRequest: AdvanceRequestMonth[] = [];
  rowsTableRequests: number = 10;
  firstTableRequests: number = 0;
  lastTableRequests = <number>4;
  totalItemsTableRequests = <number>0;
  sortBy? = <string>'';
  sortDirection? = <string>'';
  options = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];

  headersTableRequests = [
    { title: 'Linked Process', key: 'idLinkedProcess' },
    { title: 'Accountant', key: 'nameAccountant' },
    { title: 'Month', key: 'descriptionMonth' },
    { title: 'Type', key: 'descriptionTypeBudget' },
    { title: 'Value', key: 'valueBudget' },
    { title: 'Status', key: 'descriptionStatusAdvanceRequestMonth' },
  ];
  formSearch!: FormGroup;
  suggestionsAccountantsAutoComplete: Accountant[] = [];
  selectedAccountant: Accountant = {};

  @ViewChild('autoCompAccountant') autoCompAccountant!: AutoComplete;

  searchAccountantInitial() {
    if (!this.selectedAccountant.id) {
      this.searchAccountantAutoComplete({
        query: '',
      } as AutoCompleteCompleteEvent);
    }
  }

  searchAccountantAutoComplete(event: AutoCompleteCompleteEvent) {
    this.userService.getAccountants().subscribe({
      next: (response) => {
        this.suggestionsAccountantsAutoComplete = response
          .filter((accountant) =>
            (accountant.name ?? '')
              .toLowerCase()
              .includes(event.query.toLowerCase()),
          )
          .map((accountant) => ({
            id: accountant.id,
            label: `${
              accountant.employeeId != null ? String(accountant.employeeId) : ''
            } - ${accountant.name ?? ''}`,
          }));
        setTimeout(() => {
          this.autoCompAccountant.show();
        }, 0);
      },
    });
  }

  clearAutoCompleteSearch($event?: any) {
    this.selectedAccountant = {};
  }

  selectAccountantAutoComplete(event: any) {
    const selectedAccountant = event.value;
    if (!selectedAccountant) {
      return;
    }

    this.selectedAccountant = {};
    this.selectedAccountant.id = selectedAccountant.id;
  }

  searchClean() {
    this.formSearch.reset();
    this.yearPayload = this.currentYear;

    this.getSubmittedRequests(null, true);
  }

  configureSearchForm() {
    this.formSearch = this.formBuilder.group({
      searchTerm: [''],
      process: null,
      advancesByYear: null,
      idTypeBudget: null,
    });
  }

  linkedProcessChange(event: DropdownChangeEvent) {
    if (!this.idUnitCurrent || !event.value) return;

    this.proccessService
      .getProcessYears(this.idUnitCurrent, event.value)
      .subscribe((response) => {
        this.advancesByYear = response;
      });
  }

  onRowsChangeRequests(newRows: number): void {
    this.rowsTableRequests = newRows;
    this.firstTableRequests = 0;
    this.getSubmittedRequests();
  }

  getSubmittedRequests(event?: any, buttonClear?: boolean) {
    if (this.searchRequest) return;
    this.searchRequest = true;

    const payload: RequestsSearchPayload = {
      skip: 0,
      take: this.rowsTableRequests,
      firstLoad: this.firstLoad,
    };

    if (event?.page) {
      payload.skip = event?.page * this.rowsTableRequests;
      payload.take = this.rowsTableRequests;
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
      if (!this.sortStatesRequest[field]) {
        this.sortStatesRequest[field] = 1; // Ascending
      } else if (this.sortStatesRequest[field] === 1) {
        this.sortStatesRequest[field] = -1; // Descending
      } else {
        this.sortStatesRequest[field] = 0; // Reset
      }

      // Reset sorting
      for (let key in this.sortStatesRequest) {
        if (key !== field) this.sortStatesRequest[key] = 0;
      }

      if (this.sortStatesRequest[field] === 1) {
        this.sortBy = field;
        this.sortDirection = 'Ascending';
        payload.sortBy = this.sortBy;
        payload.sortDirection = this.sortDirection;
      } else if (this.sortStatesRequest[field] === -1) {
        this.sortBy = field;
        this.sortDirection = 'Descending';
        payload.sortBy = this.sortBy;
        payload.sortDirection = this.sortDirection;
      } else {
        // Reset sorting
        this.sortBy = '';
        this.sortDirection = '';
        delete payload.sortBy;
        delete payload.sortDirection;
        this.tbRequest.reset();
      }
    } else {
      if (this.sortBy) {
        payload.sortBy = this.sortBy;
        payload.sortDirection = this.sortDirection;
      }
    }

    this.firstTableRequests = event?.first || this.firstTableRequests || 0;
    this.rowsTableRequests = event?.rows || this.rowsTableRequests || 10;

    if (!this.formSearch.valid || !this.idUnitCurrent) return;

    if (this.formSearch.value.process)
      payload.processNumber = this.formSearch.value.process;
    if (this.formSearch.value.advancesByYear)
      payload.yearProcess = this.formSearch.value.advancesByYear;
    if (this.formSearch.value.idTypeBudget)
      payload.idTypeBudget = this.formSearch.value.idTypeBudget;

    if (buttonClear === true) payload.firstLoad = true;

    this.advanceRequestService
      .getRequestMonths(payload, this.idUnitCurrent)
      .subscribe({
        next: (response) => {
          this.advanceRequest = response.data;
          this.totalItemsTableRequests = response.totalElements;
          this.firstTableRequests = event?.first || 0;
          this.lastTableRequests = Math.min(
            this.firstTableRequests + this.rowsTableRequests,
            this.totalItemsTableRequests,
          );
          this.firstLoad = false;
          this.searchRequest = false;
        },
      });
  }

  // Form
  formMonthRequestAdvance!: FormGroup;
  monthAdvanceRequestModalVisibility: boolean = false;
  monthAdvanceRequestModalCurrentMode: 'edit' | 'add' | 'view' = 'add';
  confirmSaveMonthAdvanceRequestModalVisibility: boolean = false;
  visibleCancelConfirmMonthRequestAdvance: boolean = false;
  isVisibleConfirmSaveAdvanceRequest: boolean = false;
  userAccountantId?: number;

  openMonthAdvanceRequestModal(
    mode: 'edit' | 'add' | 'view',
    monthRequest: AdvanceRequestMonth,
  ) {
    this.formMonthRequestAdvance.reset();
    this.monthAdvanceRequestModalCurrentMode = mode;

    if (mode === 'edit' || mode === 'view') {
      this.formMonthRequestAdvance
        .get('idAdvanceRequestMonth')
        ?.setValue(monthRequest.advanceRequestMonthId);
      this.formMonthRequestAdvance
        .get('idLinkedProcess')
        ?.setValue(monthRequest.linkedProcessId);
      this.formMonthRequestAdvance
        .get('descriptionMonth')
        ?.setValue(monthRequest.monthDescription);
      this.formMonthRequestAdvance
        .get('processNumber')
        ?.setValue(monthRequest.processNumber);
      this.formMonthRequestAdvance
        .get('descriptionTypeBudget')
        ?.setValue(monthRequest.budgetTypeDescription);
      this.formMonthRequestAdvance
        .get('statusRequestAdvanceMonthId')
        ?.setValue(monthRequest.requestMonthStatusId);
      this.formMonthRequestAdvance
        .get('valueBudget')
        ?.setValue(monthRequest.budgetValue);
      this.formMonthRequestAdvance
        .get('descriptionReasonChangeStatus')
        ?.setValue(monthRequest.statusChangeReason);

      if (monthRequest.accountantUserId) {
        this.userService
          .getById(monthRequest.accountantUserId)
          .subscribe((response) => {
            const accountantRegistration = response.registration;
            this.formMonthRequestAdvance
              .get('userAccountantId')
              ?.setValue(
                `${accountantRegistration} - ${monthRequest.accountantName ?? ''}`,
              );
          });
        this.userAccountantId = monthRequest.accountantUserId;
      }

      if (
        monthRequest.requestMonthStatusId === 3 ||
        monthRequest.requestMonthStatusId === 5 ||
        monthRequest.requestMonthStatusId === 8
      ) {
        this.formMonthRequestAdvance
          .get('descriptionReasonChangeStatus')
          ?.setValidators([Validators.required]);
        this.isReasonStatusVisible = true;
      } else {
        this.isReasonStatusVisible = false;
      }

      if (mode === 'view') this.formMonthRequestAdvance.disable();
    }

    this.monthAdvanceRequestModalVisibility = true;
  }

  getTitleMonthRequestAdvanceModal() {
    let title = 'View';

    if (this.monthAdvanceRequestModalCurrentMode == 'add') title = 'Add';
    else if (this.monthAdvanceRequestModalCurrentMode == 'edit') title = 'Edit';

    return title + ' Advance Request e Linked Process';
  }

  openCancelConfirmMonthAdvanceRequestModal() {
    this.isVisibleCancelConfirm = true;
  }

  closeMonthAdvanceRequestModal() {
    this.monthAdvanceRequestModalVisibility = false;
    this.formMonthRequestAdvance.reset();
    this.configureFormMonthRequestAdvance();
  }

  openConfirmSaveMonthRequestAdvanceModal() {
    this.confirmSaveMonthAdvanceRequestModalVisibility = true;
  }

  openConfirmAdvanceRequestModal() {
    this.isVisibleConfirmSaveAdvanceRequest = true;
  }

  configureFormMonthRequestAdvance() {
    this.formMonthRequestAdvance = this.formBuilder.group({
      idAdvanceRequestMonth: [null],
      idLinkedProcess: ['', Validators.required],
      descriptionMonth: [{ value: '', disabled: true }, Validators.required],
      processNumber: [{ value: '', disabled: true }, Validators.required],
      descriptionTypeBudget: [
        { value: '', disabled: true },
        Validators.required,
      ],
      userAccountantId: ['', Validators.required],
      statusRequestAdvanceMonthId: ['', Validators.required],
      descriptionReasonChangeStatus: '',
      valueBudget: [null, Validators.required],
    });
  }

  budgetTypeOptions: DropdownSelect[] | undefined;
  advancesByYear: number[] | undefined;
  processLinked: ProcessSearch[] | undefined;
  changeOwnership: string = '';
  twoOpened: string = '';
  defalcation: string = '';
  optionsStatus: DropdownSelect[] | undefined;
  firstLoad: boolean = true;
  searchRequest: boolean = false;
  currentUser: AuthenticatedUser | null;
  currentUnit: any;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public userPermissionService: UserPermissionService,
    private advanceRequestService: AdvanceRequestsService,
    private proccessService: ProcessService,
    private activatedRoute: ActivatedRoute,
    private expenseTypeService: ExpenseTypeService,
    private statusRequestAdvanceMonthService: MonthlyAdvanceRequestStatusService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.formMainProcess = this.formBuilder.group({
      processNumber: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      valueBudget: [null, Validators.required],
      defalcation: ['No', Validators.required],
      changeOwnership: ['No', Validators.required],
      twoOpened: ['No', Validators.required],
      reasonDefalcation: '',
      id: null,
    });

    this.configureSearchForm();

    this.activatedRoute.data.subscribe((data) => {
      this.currentUnit = data['unit'];
      console.log(this.currentUnit);
      this.idUnitCurrent = this.currentUnit.id;
      this.getProcessDropDown();
    });

    this.initDropdowns();

    this.configureFormMonthRequestAdvance();

    this.getStatusRequestAdvanceMonthService();

    const url = this.router.url;
    this.mode = url.includes('view')
      ? 'view'
      : url.includes('edit')
        ? 'edit'
        : 'new';

    this.currentUser = this.userPermissionService.getCurrentUser();
  }

  initDropdowns() {
    this.expenseTypeService.getType().subscribe((response) => {
      this.budgetTypeOptions = [
        { id: 0, description: 'Todos' },
        ...response.filter((item) => item.id !== -1),
      ];
    });
  }

  onYearChange(event: any) {
    if (event) {
      this.yearPayload = event.getFullYear();
    }
  }

  getProcessDropDown() {
    if (!this.idUnitCurrent) return;
    this.proccessService
      .getNumberProcesses(this.idUnitCurrent)
      .subscribe((response) => {
        this.processLinked = response;

        const inProgress = response.find((x) => x.statusProcessId == 1);
        this.formSearch.get('process')?.setValue(inProgress?.processNumber);
        this.linkedProcessChange({
          value: inProgress?.processNumber,
        } as DropdownChangeEvent);

        if (inProgress?.processNumber) {
          this.firstLoad = false;
          setTimeout(() => {
            this.getSubmittedRequests();
          }, 1000);
        }
      });
  }

  removeTags(value: string) {
    return value.replace(/(<([^>]+)>)/gi, ' ');
  }

  // modal ConfirmCancel
  openCancelConfirmModal() {
    this.isVisibleCancelConfirm = true;
  }

  closeCancelConfirmModal() {
    this.isVisibleCancelConfirm = false;
  }

  openConfirmSaveModalProcessMain() {
    this.isVisibleConfirmSaveModal = true;
  }

  closeConfirmSaveModalProcessMain() {
    this.isVisibleConfirmSaveModal = false;
  }

  onRowsChangeMainProcesses(newRows: number): void {
    this.rowsTableProcessMain = newRows;
    this.firstTableProcessMain = 0;
    this.getMainProcesses();
  }

  getMainProcesses(event?: any) {
    if (this.searchInProgress) return;
    this.searchInProgress = true;

    const payload: SearchTablePayload = {
      skip: 0,
      take: this.rowsTableProcessMain,
    };

    if (event?.page) {
      payload.skip = event?.page * this.rowsTableProcessMain;
      payload.take = this.rowsTableProcessMain;
      if (this.sortByProcess) {
        payload.sortBy = this.sortByProcess;
        payload.sortDirection = this.sortDirectionProcess;
      }
    }

    if (payload.skip === 0 && this.sortByProcess) {
      payload.sortBy = this.sortByProcess;
      payload.sortDirection = this.sortDirectionProcess;
    }

    if (event?.sortField) {
      const field = event.sortField;
      if (!this.sortStates[field]) {
        this.sortStates[field] = 1; // Ascending
      } else if (this.sortStates[field] === 1) {
        this.sortStates[field] = -1; // Descending
      } else {
        this.sortStates[field] = 0; // Reset
      }

      // Reset sorting
      for (let key in this.sortStates) {
        if (key !== field) this.sortStates[key] = 0;
      }

      if (this.sortStates[field] === 1) {
        this.sortByProcess = field;
        this.sortDirectionProcess = 'Ascending';
        payload.sortBy = this.sortByProcess;
        payload.sortDirection = this.sortDirectionProcess;
      } else if (this.sortStates[field] === -1) {
        this.sortByProcess = field;
        this.sortDirectionProcess = 'Descending';
        payload.sortBy = this.sortByProcess;
        payload.sortDirection = this.sortDirectionProcess;
      } else {
        // Reset sorting
        this.sortByProcess = '';
        this.sortDirectionProcess = '';
        delete payload.sortBy;
        delete payload.sortDirection;
        this.tb.reset();
      }
    } else {
      if (this.sortByProcess) {
        payload.sortBy = this.sortByProcess;
        payload.sortDirection = this.sortDirectionProcess;
      }
    }

    this.firstTableProcessMain =
      event?.first || this.firstTableProcessMain || 0;
    this.rowsTableProcessMain = event?.rows || this.rowsTableProcessMain || 10;

    this.activatedRoute.params.subscribe((p) => {
      this.proccessService.getPaged(payload, +p['idUnit']).subscribe({
        next: (response) => {
          this.mainProcesses = response.data;

          this.totalItemsProcessMain = response.totalElements;
          this.firstTableProcessMain = event?.first || 0;

          this.lastTableProcessMain = Math.min(
            this.firstTableProcessMain + this.rowsTableProcessMain,
            this.totalItemsProcessMain,
          );

          this.searchInProgress = false;
        },
        error: (error) => {
          this.searchInProgress = false;
        },
      });
    });
    this.firstTableProcessMain =
      event?.first || this.firstTableProcessMain || 0;
  }

  saveOrEditProcessMain() {
    const edit = this.processSelected;

    const payloadData = this.formMainProcess.value;

    payloadData.valueBudget = Number(payloadData.valueBudget);

    if (payloadData.defalcation === 'Yes') {
      payloadData.defalcation = true;
    } else {
      payloadData.defalcation = false;
    }
    if (payloadData.changeOwnership === 'Yes') {
      payloadData.changeOwnership = true;
    } else {
      payloadData.changeOwnership = false;
    }
    if (payloadData.twoOpened === 'Yes') {
      payloadData.twoOpened = true;
    } else {
      payloadData.twoOpened = false;
    }

    if (payloadData.startDate)
      payloadData.startDate = this.formatDateToApi(payloadData.startDate);
    else payloadData.startDate = null;

    if (payloadData.endDate)
      payloadData.endDate = this.formatDateToApi(payloadData.endDate);
    else payloadData.endDate = null;
    edit
      ? this.editProcessMain(payloadData)
      : this.saveProcessMain(payloadData);
  }

  saveProcessMain(payloadData: MainProcessPayload) {
    this.formMainProcess.markAllAsTouched();
    if (!this.formMainProcess.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required field(s).',
      });
      this.closeConfirmSaveModalProcessMain();
      return;
    }

    const process = this.formMainProcess.get('processNumber')?.value;

    // Remove mask and keep only numbers
    const processNumber = process.replace(/\D/g, '');

    payloadData.processNumber = processNumber;
    if (!this.idUnitCurrent) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Current unit not found. Unable to save the process.',
      });
      this.closeConfirmSaveModalProcessMain();
      return;
    }

    this.proccessService.insert(payloadData, this.idUnitCurrent).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Main process created!',
        });

        this.getMainProcesses();
        this.getProcessDropDown();

        this.closeConfirmSaveModalProcessMain();
        this.closeModalProcessMain();
      },
      error: (response) => {
        this.closeConfirmSaveModalProcessMain();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error?.errors[0] || 'Error while adding Main Process',
        });
      },
    });
  }

  editProcessMain(payload: MainProcessPayload) {
    this.formMainProcess.markAllAsTouched();
    if (!this.formMainProcess.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required field(s).',
      });
      this.closeConfirmSaveModalProcessMain();
      return;
    }

    if (!this.idUnitCurrent) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Current unit not found. Unable to edit the process.',
      });
      this.closeConfirmSaveModalProcessMain();
      return;
    }

    this.proccessService.update(payload, this.idUnitCurrent).subscribe({
      next: (response) => {
        this.getMainProcesses();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Main process edited',
        });
        this.getProcessDropDown();
        this.getSubmittedRequests();

        this.closeConfirmSaveModalProcessMain();
        this.closeModalProcessMain();
      },
      error: (response) => {
        this.closeConfirmSaveModalProcessMain();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error?.errors[0] || 'Error while editing Main Process',
        });
      },
    });
  }

  getTitleModalProcessMain() {
    let title = 'View';

    if (this.modalCurrentMode == 'add') title = 'Add';
    else if (this.modalCurrentMode == 'edit') title = 'Edit';

    return title + ' Main Process';
  }

  // modal
  openModalProcessMain(mode: 'edit' | 'add' | 'view', item: any) {
    this.formMainProcess.reset();
    this.formMainProcess.enable();
    this.modalCurrentMode = mode;
    this.processSelected = item;

    if (mode === 'add') {
      this.formMainProcess.patchValue({
        defalcation: 'No',
        changeOwnership: 'No',
        twoOpened: 'No',
      });
    }

    if (mode !== 'add') {
      this.twoOpened = item.twoOpened ? 'Yes' : 'No';
      this.changeOwnership = item.changeOwnership ? 'Yes' : 'No';
      this.defalcation = item.defalcation ? 'Yes' : 'No';

      this.formMainProcess.get('processNumber')?.setValue(item.processNumber);
      this.formMainProcess.get('startDate')?.setValue(new Date(item.startDate));
      this.formMainProcess.get('endDate')?.setValue(new Date(item.endDate));
      this.formMainProcess.get('valueBudget')?.setValue(item.valueBudget);
      this.formMainProcess.get('defalcation')?.setValue(this.defalcation);
      this.formMainProcess
        .get('changeOwnership')
        ?.setValue(this.changeOwnership);
      this.formMainProcess.get('twoOpened')?.setValue(this.twoOpened);
      this.formMainProcess
        .get('reasonDefalcation')
        ?.setValue(item.reasonDefalcation);
      this.formMainProcess.get('id')?.setValue(item.id);
    }

    if (item) {
      if (item.defalcation === 'Yes' || item.defalcation === true) {
        this.isReasonVisible = true;
      } else {
        this.isReasonVisible = false;
      }
    }

    this.cdr.detectChanges();
    this.isVisibleModalProcessMain = true;
  }

  closeModalProcessMain() {
    this.isVisibleModalProcessMain = false;
    this.formMainProcess.reset();
    this.descriptionProcessMain = '';
  }

  openModalViewRequestProcessMain(item: any) {
    if (!item) return;
    this.processSelectedView = item;
    const dateInitial = new Date(item.startDate);
    this.currentYear = dateInitial.getFullYear();

    this.getRequestsByProcess(item.processNumber);
    this.isVisibleModalViewRequestProcessMain = true;
  }

  closeModalViewRequestProcessMain() {
    this.isVisibleModalViewRequestProcessMain = false;
    this.months = [];
    this.processSelectedView = undefined;
  }

  getRequestsByProcess(process: string) {
    if (!this.idUnitCurrent) return;

    const payload = {
      processNumber: process,
    };

    this.advanceRequestService
      .getRequestMonths(payload, this.idUnitCurrent)
      .subscribe({
        next: (response) => {
          this.advanceRequest = response.data;

          if (this.advanceRequest.length) {
            this.getRequestById(this.advanceRequest[0].advanceRequestId);
          } else {
            this.getInitialMonths();
          }

          this.searchRequest = false;
        },
      });
  }

  getRequestById(id: number) {
    this.advanceRequestService.getAdvanceRequestById(id).subscribe({
      next: (response) => {
        const requestDetail: AdvanceRequest = response;
        if (this.processSelectedView) {
          this.processSelectedView = {
            ...this.processSelectedView,
            descriptionUnit: requestDetail.unitDescription,
          };
        }
        this.months = requestDetail.months.map((month: Month) => ({
          monthId: month.monthId,
          description: month.description,
          requested: month.requested,
          isFieldDisabled: month.isFieldDisabled,
        }));
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

  getInitialMonths() {
    this.advanceRequestService.getInitialMonthsValue().subscribe((response) => {
      this.months = response;
    });
  }

  private formatDateToApi(date: any) {
    if ((typeof date === 'object') == false) {
      date = new Date(date);
    }

    let day = date.getDate();
    if (day < 10) day = `0${day}`;

    let month = date.getMonth() + 1;
    if (month < 10) month = `0${month}`;

    return `${date.getFullYear()}-${month}-${day}`;
  }

  onProcessChange(event: string): void {
    if (event) {
      const processNumber = event.replace(/\D/g, '');

      const processNumberFormatted =
        this.applyingMaskMainProcess(processNumber);

      this.formMainProcess
        .get('processNumber')
        ?.setValue(processNumberFormatted);
    }
  }

  applyingMaskMainProcess(number: string): string {
    return number
      .replace(/(\d{4})(\d{0,8})/, '$1/$2')
      .replace(/(\d{4}\/\d{8})(\d{0,8})/, '$1');
  }

  onReasonChange(event: any) {
    if (event.value === 'Yes') {
      this.isReasonVisible = true;
      this.formMainProcess
        .get('reasonDefalcation')
        ?.setValidators([Validators.required]);
    } else {
      this.isReasonVisible = false;
      this.formMainProcess.get('reasonDefalcation')?.clearValidators();
    }
    this.formMainProcess.get('reasonDefalcation')?.updateValueAndValidity();
  }

  getStatusRequestAdvanceMonthService() {
    this.statusRequestAdvanceMonthService.get().subscribe((response) => {
      this.optionsStatus = response;
    });
  }

  closeConfirmAdvanceRequestModal() {
    this.isVisibleConfirmSaveAdvanceRequest = false;
  }

  editAdvanceRequest() {
    this.formMonthRequestAdvance.markAllAsTouched();
    if (!this.formMonthRequestAdvance.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required field(s).',
      });
      this.closeConfirmAdvanceRequestModal();
      return;
    }

    this.formMonthRequestAdvance
      .get('userAccountantId')
      ?.setValue(this.selectedAccountant.id || this.userAccountantId);

    const payload = this.formMonthRequestAdvance.value;

    this.advanceRequestService
      .putMonthRequest(payload, this.idUnitCurrent!)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Request edited!',
          });

          this.getSubmittedRequests();
          this.getMainProcesses();
          this.closeConfirmAdvanceRequestModal();
          this.closeMonthAdvanceRequestModal();
        },
        error: (response) => {

          this.closeConfirmAdvanceRequestModal();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.error?.errors[0] || 'Error while adding Main Process',
          });
        },
      });
  }

  onLinkedProcessChange(event: string): void {
    if (event) {
      const processNumber = event.replace(/\D/g, '');
      const processNumberLimited = processNumber.slice(0, 10);
      const processNumberFormatted =
        this.applyMaskLinkedProcess(processNumberLimited);

      this.formMonthRequestAdvance
        .get('idLinkedProcess')
        ?.setValue(processNumberFormatted);
    }
  }

  applyMaskLinkedProcess(number: string): string {
    return number.replace(/(\d{2})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1$2$3$4');
  }

  onReasonStatusChange(event: DropdownChangeEvent) {
    if (event.value === 3 || event.value === 5 || event.value === 8) {
      this.isReasonStatusVisible = true;
      this.formMonthRequestAdvance
        .get('descriptionReasonChangeStatus')
        ?.setValidators([Validators.required]);
    } else {
      this.isReasonStatusVisible = false;
      this.formMonthRequestAdvance
        .get('descriptionReasonChangeStatus')
        ?.clearValidators();
    }
    this.formMonthRequestAdvance
      .get('descriptionReasonChangeStatus')
      ?.updateValueAndValidity();
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
}
