import { Component, OnInit, ViewChild } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UserService } from '../../services/user.service';
import { IconSaveComponent } from '../../components/icons/icon-save/icon-save.component';
import { IconCloseSquareComponent } from '../../components/icons/icon-close-square/icon-close-square.component';
import { IconExcelExportComponent } from '../../components/icons/icon-excel-export/icon-excel-export.component';
import { ProfileService } from '../../services/profile.service';
import { IconViewComponent } from '../../components/icons/icon-view/icon-view.component';
import { IconEdit2Component } from '../../components/icons/icon-edit2/icon-edit2.component';
import { EntityEventService } from '../../services/entity-event.service';
import { IconAddSquareComponent } from '../../components/icons/icon-add-square/icon-add-square.component';
import { IconUserXComponent } from '../../components/icons/icon-user-x/icon-user-x.component';
import { IconUserCheckComponent } from '../../components/icons/icon-user-check/icon-user-check.component';
import { IconHistoryComponent } from '../../components/icons/icon-history/icon-history.component';
import { IconChevronDownComponent } from '../../components/icons/icon-chevron-down/icon-chevron-down.component';
import { UserPermissionService } from '../../services/user-permission.service';
import { TooltipModule } from 'primeng/tooltip';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { PhonePipe } from '../../pipes/phone.pipe';
import { UserControl } from '../../models/response/UserControl';
import { Profile } from '../../models/Profile';
import { Event } from '../../models/Event';
import { UnitSelectResponse } from '../../models/response/UnitSelectResponse';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    DividerModule,
    FormsModule,
    IconCloseSquareComponent,
    IconSaveComponent,
    InputTextModule,
    ReactiveFormsModule,
    IconExcelExportComponent,
    DropdownModule,
    PaginatorModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    AutoCompleteModule,
    InputSwitchModule,
    IconViewComponent,
    IconEdit2Component,
    IconAddSquareComponent,
    IconUserXComponent,
    IconUserCheckComponent,
    IconHistoryComponent,
    IconChevronDownComponent,
    TooltipModule,
    SearchInputComponent,
    PaginatorComponent,
    PhonePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [MessageService, DatePipe],
})
export class UserComponent implements OnInit {
  @ViewChild('tb') tb!: Table;

  searchInProgress = false;
  isUserModalVisible: boolean = false;
  confirmCancelSaveUserModalVisibility: boolean = false;
  confirmSaveUserModalVisibility: boolean = false;
  isUnitSelectActive: boolean = false;
  isDisableUserModalVisibility: boolean = false;
  isEnableUserModalVisibility: boolean = false;
  historyModalVisibility = false;
  isRequired: boolean = false;

  first: number = 0;
  last = <number>4;
  rows: number = 10;
  totalItems = <number>0;
  currentPage: number = 0;
  unitSortDirection = <number>1;
  unitId: number | undefined;

  messageSuccess = 'Operation completed successfully!';
  sortBy = <string>'';
  sortDirection = <string>'';
  directoryUserSearchErrorMessage = 'Employee data not found';
  userModalMode: 'edit' | 'add' | 'view' = 'view';

  sortStates: { [key: string]: number } = {};
  options = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];
  users: UserControl[] = [];
  profiles: Profile[] = [];
  selectedProfiles: Profile[] = [];
  selectedProfileIds: number[] = [];
  unitOptions: UnitSelectResponse[] = [];
  directoryUserSuggestions: any[] = [];
  entityEvents: Event[] = [];
  userTableHeaders = [
    { title: 'Employee ID', key: 'employeeId' },
    { title: 'Name', key: 'name' },
    { title: 'Job title', key: 'jobTitle' },
    { title: 'E-mail', key: 'email' },
    { title: 'Profile', key: 'profiles' },
    { title: 'Status', key: 'isActive' },
  ];
  textAutoComplete = null;

  selectedUser: any = null;

  formSearch: FormGroup;

  private _isLinkUnitEnabled = false;

  get isLinkUnitEnabled(): boolean {
    return this._isLinkUnitEnabled;
  }

  set isLinkUnitEnabled(value: boolean) {
    this._isLinkUnitEnabled = value;
    if (!value) {
      this.unitId = undefined;
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private service: UserService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private profileService: ProfileService,
    private entityEventService: EntityEventService,
    public userPermissionService: UserPermissionService,
    private unitService: UnitService,
  ) {
    this.profileService.getAll().subscribe({
      next: (response) => {
        this.profiles = response?.map((p: any) => ({
          id: p.id,
          name: p.name ?? p.description,
          description: p.description ?? p.text,
          isSelected: false,
        }));
      },
    });
    this.formSearch = this.formBuilder.group({
      searchTerm: [''],
    });

    this.initDropdowns();
  }

  ngOnInit() {}

  initDropdowns() {
    const payload: any = {
      sortDirection: this.unitSortDirection,
    };

    this.unitService.getUnits(payload).subscribe({
      next: (response: UnitSelectResponse[]) => {
        this.unitOptions = response;
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.errors
            ? error?.error?.errors[0]
            : 'Error while loading units',
        });
      },
    });
  }

  onRowsChange(newRows: number): void {
    this.rows = newRows;
    this.first = 0;
    this.getUsers();
  }

  getUsers(event?: any) {
    if (this.searchInProgress) return;

    this.searchInProgress = true;

    const payload: any = {
      skip: 0,
      take: this.rows,
      searchString: this.formSearch.value.searchTerm!,
    };

    if (event?.page || event?.page == 0) {
      this.currentPage = event.page;
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

        this.sortDirection =
          event?.sortField == 'isActive' ? 'Descending' : 'Ascending';

        payload.sortBy = this.sortBy;
        payload.sortDirection = this.sortDirection;
      } else if (this.sortStates[field] === -1) {
        this.sortBy = field;
        this.sortDirection =
          event?.sortField == 'isActive' ? 'Ascending' : 'Descending';
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

    this.service.get(payload).subscribe({
      next: (response) => {
        this.users = response.data;

        this.totalItems = response.totalElements;
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

  searchProfilesByKeyword() {
    this.getUsers();
  }

  formatName(input: string): string {
    const words = input?.toLowerCase().split(' ');
    const formatted = words?.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    );
    return formatted?.join(' ');
  }

  formatDate(date: Date) {
    const parsedDate = new Date(date);
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy', 'UTC');
  }

  getProfilesInline(profiles: any[]) {
    return profiles
      ?.map((profile) => profile.name ?? profile.description)
      .join('; ');
  }

  getUserStatusSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
      default:
        return 'warning';
    }
  }

  exportExcel() {
    const now = new Date();
    let day = now.getDate().toString();
    day = day.length === 1 ? `0${day}` : day;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const seconds = now.getSeconds();

    this.service.exportExcel().subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `SYSTEM_USERS_${year}${month}${day}_${hours}${minutes}${seconds}.xls`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User register exported successfully!',
        });
      },
    });
  }

  openUserModal(mode: 'edit' | 'add' | 'view', user: any) {
    this.userModalMode = mode;
    this.isUserModalVisible = true;

    if ((mode === 'edit' || mode === 'view') && user) {
      this.selectedUser = user;
      this.unitId = this.selectedUser.unitId;
      if (this.unitId) {
        this._isLinkUnitEnabled = true;
      }

      this.selectedProfiles = JSON.parse(JSON.stringify(this.profiles))?.map(
        (p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          isSelected:
            user?.profiles?.findIndex((pu: any) => pu.id == p.id) !== -1,
        }),
      );
    } else {
      this.selectedProfiles = JSON.parse(JSON.stringify(this.profiles));
    }
  }

  closeUserModal(isCancel?: boolean) {
    this.isUserModalVisible = false;

    this.directoryUserSuggestions = [];
    this.selectedUser = null;
    this.textAutoComplete = null;
    this.isLinkUnitEnabled = false;

    if (this.userModalMode != 'view' && isCancel) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `No user ${
          this.userModalMode == 'add' ? ' was created.' : ' was edited.'
        }`,
      });
    }
  }

  getModalTitle() {
    let title = 'View';

    if (this.userModalMode == 'add') title = 'Add';
    else if (this.userModalMode == 'edit') title = 'Edit';

    return title + ' System User';
  }

  saveOrEdit() {
    const PROFILE_UNIT_ID = 2;

    this.selectedProfileIds =
      this.selectedProfiles
        ?.filter((profile) => profile.isSelected)
        ?.map((profile) => profile.id) || [];

    if (this.unitId && !this.selectedProfileIds.includes(PROFILE_UNIT_ID)) {
      this.selectedProfileIds.push(PROFILE_UNIT_ID);
    }

    if (this.userModalMode === 'add') this.saveUser();
    else this.editUser();
  }

  openConfirmCancelSaveUserModal() {
    this.confirmCancelSaveUserModalVisibility = true;
  }

  closeConfirmCancelSaveUserModal() {
    this.confirmCancelSaveUserModalVisibility = false;
  }

  searchDirectoryUsers(event: AutoCompleteCompleteEvent) {
    if (event.query.length < 3) {
      this.directoryUserSuggestions = [];
    }

    this.service.getDirectoryUsers(event.query).subscribe({
      next: (response: any) => {
        this.directoryUserSuggestions = response;
      },
      error: (response: any) => {
        let message = this.directoryUserSearchErrorMessage;
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
      },
    });
  }

  clearDirectoryUserSearch($event: any) {
    this.selectedUser = null;
  }

  selectDirectoryUser(event: any) {
    const selectedDirectoryUser = event.value;

    if (!selectedDirectoryUser) {
      return;
    }

    this.selectedUser = {};

    this.selectedUser.id = selectedDirectoryUser.id;
    this.selectedUser.employeeId = selectedDirectoryUser.employeeId;
    this.selectedUser.name = selectedDirectoryUser.name;
    this.selectedUser.jobTitle = selectedDirectoryUser?.jobTitle;
    this.selectedUser.email = selectedDirectoryUser?.email;
    this.selectedUser.unitName = selectedDirectoryUser?.unitName;
    this.selectedUser.phone = selectedDirectoryUser?.phone;
  }

  openConfirmSaveUserModal() {
    if (this.isLinkUnitEnabled && !this.unitId) {
      this.isRequired = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required field(s).',
      });
      return;
    }
    this.confirmSaveUserModalVisibility = true;
  }

  closeConfirmSaveUserModal() {
    this.confirmSaveUserModalVisibility = false;
  }

  saveUser() {
    const payload = {
      ...this.selectedUser,
      id: null,
      azureAdId: this.selectedUser?.id,
      profiles: this.selectedProfileIds,
      unitId: this.unitId,
    };

    this.service.insert(payload).subscribe({
      next: (response) => {
        this.getUsers();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });

        this.closeConfirmSaveUserModal();
        this.closeUserModal();
      },
      error: (response) => {
        let message = 'Error while creating the user';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.closeConfirmSaveUserModal();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
      },
    });
  }

  editUser() {
    const payload = {
      profiles: this.selectedProfileIds,
      unitId: this.unitId,
    };

    this.service.update(this.selectedUser.id, payload).subscribe({
      next: (response) => {
        this.getUsers();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });

        this.closeConfirmSaveUserModal();
        this.closeUserModal();
      },
      error: (response) => {
        let message = 'Error while editing the user';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.closeConfirmSaveUserModal();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
      },
    });
  }

  openDisableUserModal(user: any) {
    this.selectedUser = user;
    this.isDisableUserModalVisibility = true;
  }

  closeDisableUserModal() {
    this.isDisableUserModalVisibility = false;
    this.selectedUser = null;
  }

  disableUser() {
    this.service.disable(this.selectedUser.id).subscribe({
      next: (response) => {
        this.getUsers();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });
        this.closeDisableUserModal();
      },
      error: (response) => {
        let message = 'Error while deactivating the user';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
      },
    });
  }

  openEnableUserModal(user: any) {
    this.selectedUser = user;
    this.isEnableUserModalVisibility = true;
  }

  closeEnableUserModal() {
    this.isEnableUserModalVisibility = false;
    this.selectedUser = null;
  }

  enableUser() {
    this.service.enable(this.selectedUser.id).subscribe({
      next: (response) => {
        this.getUsers();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messageSuccess,
        });
        this.closeEnableUserModal();
      },
      error: (response) => {
        let message = 'Error while activating the user';
        if (response?.error?.errors) message = response?.error?.errors[0];

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
      },
    });
  }

  openHistoryModal(user: any) {
    this.selectedUser = user;

    this.entityEventService.getByIdEntity(user.id, 'user').subscribe({
      next: (response) => {
        this.entityEvents = response;
        this.historyModalVisibility = true;
      },
    });
  }

  closeHistoryModal() {
    this.historyModalVisibility = false;
    this.selectedUser = null;
    this.entityEvents = [];
  }

  onUnitChange() {
    if (this.unitId) {
      this.isRequired = false;
    }
  }
}
