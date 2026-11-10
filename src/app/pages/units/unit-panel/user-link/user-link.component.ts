import { Component, ViewChild } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { Button, ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule, DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UserPermissionService } from '../../../../services/user-permission.service';
import { UnitService } from '../../../../services/unit.service';
import { IconViewComponent } from '../../../../components/icons/icon-view/icon-view.component';
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UserUnitResponse } from '../../../../models/response/UserUnitResponse';
import { OwnerSelectResponse } from '../../../../models/response/OwnerSelectResponse';
import { IconCloseSquareComponent } from '../../../../components/icons/icon-close-square/icon-close-square.component';
import { HistoryResponse } from '../../../../models/response/HistoryResponse';
import { PaginatorModule } from 'primeng/paginator';
import { PayloadPaged } from '../../../../models/PayloadPaged';
import { TagModule } from 'primeng/tag';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-user-link',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    CardModule,
    ButtonModule,
    Button,
    DialogModule,
    FormsModule,
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    RouterModule,
    DropdownModule,
    InputSwitchModule,
    DropdownModule,
    PaginatorModule,
    ToastModule,
    TagModule,
    IconViewComponent,
    IconCloseSquareComponent,
    PaginatorComponent,
  ],
  providers: [MessageService, DatePipe],
  templateUrl: './user-link.component.html',
  styleUrl: './user-link.component.scss',
})
export class UserLinkComponent {
  sortStates: { [key: string]: number } = {};
  @ViewChild('tb') tb!: Table;
  sortStatesHistory: { [key: string]: number } = {};
  @ViewChild('tbHistory') tbHistory!: Table;

  formChangeOwner: FormGroup;
  searchInProgress = false;
  modalConfirmMode: 'activate' | 'deactivate' = 'activate';
  modalMode: 'link' | 'unlink' = 'link';
  mode: 'view' | 'edit' | 'new' = 'new';
  isVisibleConfirmActivateDeactivate: boolean = false;
  isVisibleConfirmChangeOwner: boolean = false;
  isVisibleViewHistoryModal: boolean = false;
  idUnit: number | undefined;
  idSelectedUserOwner: number | undefined;
  idSelectedUserLink: number | undefined;

  first = <number>0;
  last = <number>4;
  rows = <number>10;
  totalItems = <number>0;
  sortBy = <string | string[]>'';
  sortDirection = <string>'';
  options = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];

  usersPaginated: UserUnitResponse[] | undefined;
  users: OwnerSelectResponse[] | undefined;
  showInactive: boolean = false;

  headersTableLinkedUsers = [
    { title: 'Matrícula', key: 'registration' },
    { title: 'Name', key: 'name' },
    { title: 'Profile', key: 'descriptionProfile' },
    { title: 'Situação ', key: 'descriptionStatus' },
  ];

  //Modal history

  historyPaginated: HistoryResponse[] | undefined;
  registrationName: string = '';

  sortByHistory = <string | number>'';
  sortDirectionHistory = <string | number>'';
  firstHistory: number = 0;
  lastHistory = <number>4;
  rowsHistory: number = 10;
  totalItemsHistory = <number>0;
  optionsHistory = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];

  headersTableHistory = [
    { title: 'Occurrence', key: 'occurrence' },
    { title: 'Month Reference', key: 'monthReference' },
    { title: 'Date and Hour', key: 'dateHourAction' },
    { title: 'Registration - Name Owner', key: 'registrationNewUserOwner' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public userPermissionService: UserPermissionService,
    private unitService: UnitService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    const unit = this.activatedRoute.snapshot.data['unit'];
    const url = this.router.url;
    this.mode = url.includes('view')
      ? 'view'
      : url.includes('edit')
        ? 'edit'
        : 'new';

    this.formChangeOwner = this.formBuilder.group({
      id: null,
      registration: null,
      name: '',
      descriptionProfile: '',
      descriptionStatus: '',
      status: null,
    });

    if (this.mode == 'view') {
      this.formChangeOwner.disable();
    }
    this.idUnit = unit.id;

    this.getUsersPaginated();
    this.getUsers();
  }

  getUsers() {
    this.unitService.getUsers(this.idUnit).subscribe({
      next: (response) => {
        this.users = response;
        this.users.push({
          id: null,
          name: 'Awaiting New Owner',
          registration: '',
          userOwnerUnit: undefined,
        });

        const userOwner = this.users?.find(
          (user) => user.userOwnerUnit === true,
        );
        if (userOwner) {
          this.idSelectedUserOwner = userOwner.id!;
          this.formChangeOwner.patchValue({
            id: userOwner.id,
          });
        } else {
          this.users = this.users.map((user) => {
            if (user.id == null) {
              user.userOwnerUnit = true;
              this.formChangeOwner.get('id')?.setValue(null);
            }
            return user;
          });
        }

        this.users = response.map((u: OwnerSelectResponse) => ({
          id: u.id,
          label: `${u.registration ?? ''} - ${u.name ?? ''}`,
        }));
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error?.error?.errors[0] ||
            'Error loading users in the owner selection dropdown.',
        });
      },
    });
  }

  onRowsChange(newRows: number): void {
    this.rows = newRows;
    this.first = 0;
    this.getUsersPaginated();
  }

  getUsersPaginated(event?: any) {
    if (this.searchInProgress) return;
    this.searchInProgress = true;

    let payload: PayloadPaged = {
      skip: 0,
      take: this.rows,
    };

    if (!this.showInactive) {
      payload.includeInactive = true;
    } else {
      delete payload.includeInactive;
    }

    if (event?.page) {
      payload.skip = event?.page * this.rows;
      payload.take = this.rows;
      if (this.sortBy) {
        payload.SortBy = this.sortBy;
        payload.SortDirection = this.sortDirection;
      }
    }

    if (payload.skip === 0 && this.sortBy) {
      payload.SortBy = this.sortBy;
      payload.SortDirection = this.sortDirection;
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
        this.sortBy = field;
        this.sortDirection =
          field == 'descriptionStatus' ? 'Descending' : 'Ascending';
        payload.SortBy = this.sortBy;
        payload.SortDirection = this.sortDirection;
      } else if (this.sortStates[field] === -1) {
        this.sortBy = field;
        this.sortDirection =
          field == 'descriptionStatus' ? 'Ascending' : 'Descending';
        payload.SortBy = this.sortBy;
        payload.SortDirection = this.sortDirection;
      } else {
        // Reset sorting
        this.sortBy = '';
        this.sortDirection = '';
        delete payload.SortBy;
        delete payload.SortDirection;
        this.tb.reset();
      }
    } else {
      if (this.sortBy) {
        payload.SortBy = this.sortBy;
        payload.SortDirection = this.sortDirection;
      }
    }

    this.first = event?.first || this.first || 0;
    this.rows = event?.rows || this.rows || 10;

    this.unitService.getUsersPaged(this.idUnit, payload).subscribe({
      next: (response) => {
        this.usersPaginated = response.data;

        this.totalItems = response.totalElements;
        this.first = event?.first || 0;
        this.last = Math.min(this.first + this.rows, this.totalItems);
        this.searchInProgress = false;
      },
      error: (error) => {
        this.searchInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error?.error?.errors[0] ||
            'Error loading linked users',
        });
      },
    });

    this.first = event?.first || this.first || 0;
  }

  onRowsChangeHistory(newRows: number): void {
    this.rowsHistory = newRows;
    this.firstHistory = 0;
    this.getHistoryPaginated();
  }

  getHistoryPaginated(event?: any) {
    if (this.searchInProgress) return;
    this.searchInProgress = true;

    if (event) {
      this.firstHistory = event.first || 0;
      this.rowsHistory = event.rows || 10;
    }

    let payload: any = {
      skip: this.firstHistory,
      take: this.rowsHistory,
    };

    if (event?.page) {
      payload.skip = event?.page * this.rowsHistory;
      payload.take = this.rowsHistory;
      if (this.sortByHistory) {
        payload.SortBy = this.sortByHistory;
        payload.SortDirection = this.sortDirectionHistory;
      }
    }

    if (payload.skip === 0 && this.sortByHistory) {
      payload.SortBy = this.sortByHistory;
      payload.SortDirection = this.sortDirectionHistory;
    }

    if (event?.sortField) {
      const field = event.sortField;
      if (!this.sortStatesHistory[field]) {
        this.sortStatesHistory[field] = 1; // Ascending
      } else if (this.sortStatesHistory[field] === 1) {
        this.sortStatesHistory[field] = -1; // Descending
      } else {
        this.sortStatesHistory[field] = 0; // Reset
      }

      // Reset sorting
      for (let key in this.sortStatesHistory) {
        if (key !== field) this.sortStatesHistory[key] = 0;
      }

      if (this.sortStatesHistory[field] === 1) {
        this.sortByHistory = field;
        this.sortDirectionHistory = 'Ascending';
        payload.SortBy = this.sortByHistory;
        payload.SortDirection = this.sortDirectionHistory;
      } else if (this.sortStatesHistory[field] === -1) {
        this.sortByHistory = field;
        this.sortDirectionHistory = 'Descending';
        payload.SortBy = this.sortByHistory;
        payload.SortDirection = this.sortDirectionHistory;
      } else {
        // Reset sorting
        this.sortByHistory = '';
        this.sortDirectionHistory = '';
        delete payload.SortBy;
        delete payload.SortDirection;
        this.tbHistory.reset();
      }
    } else {
      if (this.sortByHistory) {
        payload.SortBy = this.sortByHistory;
        payload.SortDirection = this.sortDirectionHistory;
      }
    }

    this.firstHistory = event?.first || this.firstHistory || 0;
    this.rowsHistory = event?.rows || this.rowsHistory || 10;

    this.unitService.getHistoryPaged(this.idUnit, payload).subscribe({
      next: (response) => {
        this.historyPaginated = response.data;

        this.totalItemsHistory = response.totalElements;
        this.firstHistory = event?.first || 0;
        this.lastHistory = Math.min(
          (this.firstHistory || 0) +
            (this.rowsHistory || this.totalItemsHistory),
          this.totalItemsHistory,
        );
        this.searchInProgress = false;

        this.historyPaginated = response.data.map((h) => ({
          ...h,
          registrationName: `${h.registrationNewUserOwner ?? ''} - ${
            h.nameNewUserOwner ?? ''
          }`,
        }));
      },
      error: (error) => {
        this.searchInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error?.error?.errors[0] || 'Error loading history',
        });
      },
    });

    this.firstHistory = event?.first || this.firstHistory || 0;
  }

  changeOwner(id?: number) {
    this.modalMode = 'link';

    this.formChangeOwner.markAllAsTouched();

    if (!this.formChangeOwner.valid) {
      return;
    }

    this.unitService.changeOwner(this.idUnit, id).subscribe({
      next: (response) => {
        this.isVisibleConfirmChangeOwner = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Owner successfully updated.',
        });
        this.getUsersPaginated();
        this.getUsers();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.errors[0] || 'Error  changing owner',
        });
      },
    });
  }

  activateUser() {
    this.unitService.activate(this.idUnit, this.idSelectedUserLink).subscribe({
      next: (response) => {
        this.isVisibleConfirmActivateDeactivate = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User activated!',
        });
        this.getUsersPaginated();
        this.getUsers();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error?.error?.errors[0] || 'Error activating user',
        });
      },
    });
  }

  deactivateUser() {
    this.unitService
      .deactivate(this.idUnit, this.idSelectedUserLink)
      .subscribe({
        next: (response) => {
          this.isVisibleConfirmActivateDeactivate = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User deactivated!',
          });
          this.getUsersPaginated();
          this.getUsers();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error?.error?.errors[0] || 'Error deactivating user',
          });
        },
      });
  }

  openViewHistory() {
    this.isVisibleViewHistoryModal = true;
    this.getHistoryPaginated();
  }

  openConfirmActivateDeactivate(id?: number, status?: boolean) {
    this.idSelectedUserLink = id;
    this.modalConfirmMode = status ? 'deactivate' : 'activate';
    this.isVisibleConfirmActivateDeactivate = true;
  }

  closeConfirmActivateDeactivate() {
    this.modalConfirmMode = 'activate';
    this.isVisibleConfirmActivateDeactivate = false;
  }

  openConfirmChangeOwner(id?: number) {
    if (!this.userPermissionService.hasPermission('LinkUsersUnit', 'Edit')) {
      return;
    }
    this.modalMode = 'link';
    this.isVisibleConfirmChangeOwner = true;
    this.idSelectedUserOwner = id;
  }

  onChangeInactive() {
    this.getUsersPaginated();
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
}
