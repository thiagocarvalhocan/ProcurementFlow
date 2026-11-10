import { Component, ViewChild } from '@angular/core';
import { MaterialServiceLinkService } from '../../../../services/material-service-link.service';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPermissionService } from '../../../../services/user-permission.service';
import { IconUnlinkComponent } from '../../../../components/icons/icon-unlink/icon-unlink.component';
import { IconViewComponent } from '../../../../components/icons/icon-view/icon-view.component';
import { ToastModule } from 'primeng/toast';
import { IconLinkComponent } from '../../../../components/icons/icon-link/icon-link.component';
import { IconCloseSquareComponent } from '../../../../components/icons/icon-close-square/icon-close-square.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaterialServiceAlertService } from '../../../../services/material-service-alert.service';
import { IconSaveComponent } from '../../../../components/icons/icon-save/icon-save.component';
import { IconSearchNormalComponent } from '../../../../components/icons/icon-search-normal/icon-search-normal.component';
import { MaterialServiceService } from '../../../../services/material-service.service';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { UserResponse } from '../../../../models/response/UserResponse';
import { MaterialServiceResponse } from '../../../../models/response/MaterialServiceResponse';
import { MaterialServiceLinkedUnitResponse } from '../../../../models/response/MaterialServiceLinkedUnitResponse';
import { MaterialServiceUnit } from '../../../../models/MaterialServiceUnit';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { AuthenticatedUser } from '../../../../core/auth/models/authenticated-user';
import { AlertType } from '../../../../models/AlertType';

@Component({
  selector: 'app-material-service-unit',
  standalone: true,
  imports: [
    ToastModule,
    IconViewComponent,
    IconLinkComponent,
    IconUnlinkComponent,
    ButtonModule,
    DialogModule,
    TableModule,
    PaginatorModule,
    CardModule,
    InputTextModule,
    TooltipModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IconCloseSquareComponent,
    IconSaveComponent,
    IconSearchNormalComponent,
    PaginatorComponent,
  ],
  templateUrl: './material-service-unit.component.html',
  styleUrl: './material-service-unit.component.scss',
})
export class MaterialServiceUnitComponent {
  mode: 'view' | 'edit' | 'new' = 'new';
  sortStates: { [key: string]: number } = {};
  @ViewChild('tb') tb!: Table;
  sortStatesModal: { [key: string]: number } = {};
  @ViewChild('tbModal') tbModal!: Table;

  materialServiceLinks: MaterialServiceLinkedUnitResponse[] = [];
  rowsMaterialServiceLinksTable: number = 10;
  firstMaterialServiceLinksTable: number = 0;
  lastMaterialServiceLinksTable = <number>4;
  loadingMaterialServiceLinks = false;
  sortByMaterialServiceLinksTable = <string | undefined>'';
  sortDirectionMaterialServiceLinksTable = <string | undefined>'';
  totalItemsMaterialServiceLinksTable = <number>0;
  headerMaterialServiceLinksTable = [
    { title: 'Type', key: 'descriptionTypeMaterial' },
    { title: 'Group', key: 'descriptionGroup' },
    { title: 'Material or Service Description', key: 'description' },
    { title: 'Period', key: 'startDate' },
    { title: 'Situation', key: 'active' },
  ];
  optionsLinksTable = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];
  inProgressOnLazyLoadLinksTable = false;
  idUnitCurrent: number | null = null;

  formWarning!: FormGroup;
  formSearch!: FormGroup;
  searchInProgress = false;
  isVisibleModalViewWarnings: boolean = false;
  isVisibleModalLinkMaterialService: boolean = false;
  isVisibleCancelConfirm: boolean = false;
  isVisibleModalUnlink: boolean = false;
  isVisibleSaveConfirm: boolean = false;
  warnings: AlertType[] = [];
  materials: MaterialServiceResponse[] = [];
  materialServiceId: number | null = null;
  headersModalLinkMaterialService = [
    { title: 'Type', key: 'descriptionTypeMaterial' },
    { title: 'Group', key: 'descriptionGroup' },
    { title: 'Material or Service Description', key: 'description' },
    { title: 'Prazo', key: 'startDate' },
  ];
  optionsModalLink = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];
  materialServiceModalLink: any[] = [];
  rowsModalLink: number = 10;
  firstModalLink: number = 0;
  lastModalLink = <number>4;
  // loadingMaterialServiceLinks = false;
  sortByModalLink = <string>'';
  sortDirectionModalLink = <string>'';
  totalItemsModalLink = <number>0;
  selectedMaterial!: MaterialServiceLinkedUnitResponse;
  selectedMaterials: MaterialServiceResponse[] = [];
  currentUser: AuthenticatedUser | null;

  constructor(
    private formBuilder: FormBuilder,
    private service: MaterialServiceLinkService,
    private serviceWarning: MaterialServiceAlertService,
    private serviceMaterials: MaterialServiceService,
    private activatedRoute: ActivatedRoute,
    public userPermissionService: UserPermissionService,
    private router: Router,
    private messageService: MessageService,
  ) {
    const url = this.router.url;
    this.mode = url.includes('view')
      ? 'view'
      : url.includes('edit')
        ? 'edit'
        : 'new';

    this.activatedRoute.params.subscribe((p) => {
      this.idUnitCurrent = +p['idUnit'];
    });
    this.initFormWarning();
    this.initFormSearch();

    this.currentUser = this.userPermissionService.getCurrentUser();
  }

  initFormWarning() {
    this.formWarning = this.formBuilder.group({
      description: [''],
    });
  }

  initFormSearch() {
    this.formSearch = this.formBuilder.group({
      Description: [null],
    });
  }

  onRowsChange(newRows: number): void {
    this.rowsMaterialServiceLinksTable = newRows;
    this.firstMaterialServiceLinksTable = 0;
    this.getLinks();
  }

  getLinks(event?: any, local?: string) {
    if (this.loadingMaterialServiceLinks || this.inProgressOnLazyLoadLinksTable)
      return;

    this.loadingMaterialServiceLinks = true;
    this.inProgressOnLazyLoadLinksTable = local == 'onLazyLoad';

    const payload: MaterialServiceUnit = {
      skip: 0,
      take: this.rowsMaterialServiceLinksTable,
    };

    if (event?.page) {
      payload.skip = event?.page * this.rowsMaterialServiceLinksTable;
      payload.take = this.rowsMaterialServiceLinksTable;
      if (this.sortByMaterialServiceLinksTable) {
        payload.sortBy = this.sortByMaterialServiceLinksTable;
        payload.sortDirection = this.sortDirectionMaterialServiceLinksTable;
      }
    }

    if (payload.skip === 0 && this.sortByMaterialServiceLinksTable) {
      payload.sortBy = this.sortByMaterialServiceLinksTable;
      payload.sortDirection = this.sortDirectionMaterialServiceLinksTable;
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
        this.sortByMaterialServiceLinksTable = field;
        this.sortDirectionMaterialServiceLinksTable = 'Ascending';
        payload.sortBy = this.sortByMaterialServiceLinksTable;
        payload.sortDirection = this.sortDirectionMaterialServiceLinksTable;
      } else if (this.sortStates[field] === -1) {
        this.sortByMaterialServiceLinksTable = field;
        this.sortDirectionMaterialServiceLinksTable = 'Descending';
        payload.sortBy = this.sortByMaterialServiceLinksTable;
        payload.sortDirection = this.sortDirectionMaterialServiceLinksTable;
      } else {
        // Reset sorting
        this.sortByMaterialServiceLinksTable = '';
        this.sortDirectionMaterialServiceLinksTable = '';
        delete payload.sortBy;
        delete payload.sortDirection;
        this.tb.reset();
      }
    } else {
      if (this.sortByMaterialServiceLinksTable) {
        payload.sortBy = this.sortByMaterialServiceLinksTable;
        payload.sortDirection = this.sortDirectionMaterialServiceLinksTable;
      }
    }

    this.firstMaterialServiceLinksTable =
      event?.first || this.firstMaterialServiceLinksTable || 0;
    this.rowsMaterialServiceLinksTable =
      event?.rows || this.rowsMaterialServiceLinksTable || 10;

    this.service.getAllPagedByUnit(this.idUnitCurrent!, payload).subscribe({
      next: (response) => {
        this.materialServiceLinks = response.data;
        this.totalItemsMaterialServiceLinksTable = response.totalElements;
        this.firstMaterialServiceLinksTable = event?.first || 0;
        this.lastMaterialServiceLinksTable = Math.min(
          this.firstMaterialServiceLinksTable +
            this.rowsMaterialServiceLinksTable,
          this.totalItemsMaterialServiceLinksTable,
        );
        this.loadingMaterialServiceLinks = false;

        setTimeout(() => {
          this.inProgressOnLazyLoadLinksTable = false;
        }, 100);
      },
      error: (response) => {
        this.loadingMaterialServiceLinks = false;

        setTimeout(() => {
          this.inProgressOnLazyLoadLinksTable = false;
        }, 100);
      },
    });

    this.firstMaterialServiceLinksTable =
      event?.first || this.firstMaterialServiceLinksTable || 0;
  }

  getAvisos() {
    this.serviceWarning
      .getAllByIdUnit(this.materialServiceId, this.idUnitCurrent)
      .subscribe((response) => {
        this.warnings = response;
      });
  }

  search(event?: any) {
    if (this.searchInProgress) return;
    this.searchInProgress = true;

    const payload: any = {
      skip: 0,
      take: this.rowsModalLink,
      Description: this.formSearch.get('Description')?.value,
    };

    if (event?.page) {
      payload.skip = event?.page * this.rowsModalLink;
      payload.take = this.rowsModalLink;
      if (this.sortByModalLink) {
        payload.SortBy = this.sortByModalLink;
        payload.SortDirection = this.sortDirectionModalLink;
      }
    }

    if (payload.skip === 0 && this.sortByModalLink) {
      payload.SortBy = this.sortByModalLink;
      payload.SortDirection = this.sortDirectionModalLink;
    }

    if (event?.sortField) {
      const field = event.sortField;
      if (!this.sortStatesModal[field]) {
        this.sortStatesModal[field] = 1; // Ascending
      } else if (this.sortStatesModal[field] === 1) {
        this.sortStatesModal[field] = -1; // Descending
      } else {
        this.sortStatesModal[field] = 0; // Reset
      }

      // Reset sorting
      for (let key in this.sortStatesModal) {
        if (key !== field) this.sortStatesModal[key] = 0;
      }

      if (this.sortStatesModal[field] === 1) {
        this.sortByModalLink = field;
        this.sortDirectionModalLink =
          field == 'active' ? 'Descending' : 'Ascending';
        payload.SortBy = this.sortByModalLink;
        payload.SortDirection = this.sortDirectionModalLink;
      } else if (this.sortStatesModal[field] === -1) {
        this.sortByModalLink = field;
        this.sortDirectionModalLink =
          field == 'active' ? 'Ascending' : 'Descending';
        payload.SortBy = this.sortByModalLink;
        payload.SortDirection = this.sortDirectionModalLink;
      } else {
        // Reset sorting
        this.sortByModalLink = '';
        this.sortDirectionModalLink = '';
        delete payload.SortBy;
        delete payload.SortDirection;
        this.tbModal.reset();
      }
    } else {
      if (this.sortByModalLink) {
        payload.SortBy = this.sortByModalLink;
        payload.SortDirection = this.sortDirectionModalLink;
      }
    }

    this.firstModalLink = event?.first || this.firstModalLink || 0;
    this.rowsModalLink = event?.rows || this.rowsModalLink || 10;

    this.serviceMaterials
      .getMaterialsByUnit(payload, this.idUnitCurrent)
      .subscribe({
        next: (response) => {
          this.materials = response;
          // this.totalItemsModalLink = response.totalElements;
          this.firstModalLink = event?.first || 0;
          this.lastModalLink = Math.min(
            this.firstModalLink + this.rowsModalLink,
            this.totalItemsModalLink,
          );
          this.searchInProgress = false;
          this.sortByModalLink = '';
          this.sortDirectionModalLink = '';
        },
        error: (response) => {
          this.searchInProgress = false;
        },
      });
    this.firstModalLink = event?.first || this.firstModalLink || 0;
  }

  openModalView(value: any) {
    this.isVisibleModalViewWarnings = true;
    this.materialServiceId = value.materialServiceId;
    this.getAvisos();
  }

  openModalLinkMaterialService() {
    this.isVisibleModalLinkMaterialService = true;
    this.search();
  }

  openCancelConfirmModal() {
    this.isVisibleCancelConfirm = true;
  }

  closeCancelConfirmModal() {
    this.isVisibleCancelConfirm = false;
    this.isVisibleModalLinkMaterialService = false;
    this.selectedMaterials = [];
    this.materials = [];
    this.formSearch.reset();
  }

  openConfirmSaveLink() {
    this.isVisibleSaveConfirm = true;
  }

  closeConfirmSaveLink() {
    this.isVisibleSaveConfirm = false;
    this.materials = [];
    this.formSearch.reset();
  }

  saveLink() {
    let selectedMaterials: MaterialServiceResponse[] = [];
    if (this.selectedMaterials) {
      selectedMaterials = this.selectedMaterials;
    }
    const payload = {
      idsMaterialsServices: selectedMaterials
        .filter((material: { id: any }) => material.id)
        .map((material: { id: any }) => material.id),
    };

    if (payload.idsMaterialsServices.length == 0) {
      {
        this.messageService.add({
          life: 5000,
          severity: 'error',
          summary: 'Error',
          detail:
            'It is mandatory to select at least one Material or Service to perform the link with the Unit.',
        });
        this.closeConfirmSaveLink();
        return;
      }
    }

    this.service.link(this.idUnitCurrent, payload).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Operation completed successfully',
        });
        this.getLinks();
        this.selectedMaterials = [];
        this.search();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.errors
            ? error?.error?.errors[0]
            : 'Error performing operation',
        });
      },
    });
    this.closeConfirmSaveLink();
    this.isVisibleModalLinkMaterialService = false;
  }

  openConfirmUnlink(value: MaterialServiceLinkedUnitResponse) {
    this.selectedMaterial = value;
    this.isVisibleModalUnlink = true;
  }

  closeConfirmUnlink() {
    this.isVisibleModalUnlink = false;
  }

  unlink() {
    this.service.unlink(this.selectedMaterial.id).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Operation completed successfully',
        });
        this.getLinks();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.errors
            ? error?.error?.errors[0]
            : 'Error performing operation',
        });
        return;
      },
    });
    this.closeConfirmUnlink();
  }

  isWarningValid(warning: any): boolean {
    return (
      Array.isArray(warning.warnings) &&
      warning.warnings.length > 0 &&
      warning.warnings.some((msg: null) => msg != null)
    );
  }

  isAccountantSameUnit(): boolean {
    if (
      !this.currentUser ||
      !this.currentUser.isMonthlyRequestAccountant ||
      this.idUnitCurrent == null
    )
      return false;

    return (
      this.currentUser.monthlyRequestAccountantUnitIds?.includes(this.idUnitCurrent) ??
      false
    );
  }
}
