import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Button, ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { IconAddSquareComponent } from '../../components/icons/icon-add-square/icon-add-square.component';
import { IconCleanComponent } from '../../components/icons/icon-clean/icon-clean.component';
import { IconMaterialsServicesComponent } from '../../components/icons/icon-materials-services/icon-materials-services.component';
import { IconProcessComponent } from '../../components/icons/icon-process/icon-process.component';
import { IconSearchNormalComponent } from '../../components/icons/icon-search-normal/icon-search-normal.component';
import { IconUnitComponent } from '../../components/icons/icon-unit/icon-unit.component';
import { IconViewComponent } from '../../components/icons/icon-view/icon-view.component';
import { UnitResponse } from '../../models/response/UnitResponse';
import { ProcessNumberPipe } from '../../pipes/process-number.pipe';
import { UnitService } from '../../services/unit.service';
import { UserPermissionService } from '../../services/user-permission.service';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    Button,
    InputTextModule,
    DialogModule,
    FormsModule,
    TableModule,
    ReactiveFormsModule,
    InputMaskModule,
    DropdownModule,
    PaginatorModule,
    RouterModule,
    IconCleanComponent,
    IconAddSquareComponent,
    IconSearchNormalComponent,
    IconViewComponent,
    IconUnitComponent,
    IconProcessComponent,
    IconMaterialsServicesComponent,
    TooltipModule,
    ProcessNumberPipe,
    PaginatorComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss',
})
export class UnitsComponent {
  sortStates: { [key: string]: number } = {};
  @ViewChild('tb') tb!: Table;

  formSearch: FormGroup;
  searchInProgress = false;
  date1: Date | undefined;
  units: UnitResponse[] = [];
  currentMode: 'view' | 'edit' = 'view';

  first: number = 0;
  last = <number>4;
  rows: number = 10;
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

  headersTableUnits = [
    { title: 'Code', key: 'id' },
    { title: 'Unit SOF', key: 'sofUnitDescription' },
    { title: 'Responsible Owner', key: 'nameUserOwnerUnit' },
    { title: 'Main Process', key: 'processNumber' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public userPermissionService: UserPermissionService,
    private unitService: UnitService,
    private messageService: MessageService,
  ) {
    this.formSearch = this.formBuilder.group({
      descriptionUnitSof: null,
      processNumber: '',
    });
  }

  onRowsChange(newRows: number): void {
    this.rows = newRows;
    this.first = 0;
    this.searchUnits();
  }

  searchUnits(event?: any) {
    if (this.searchInProgress) return;

    this.searchInProgress = true;

    const payload: any = {
      skip: 0,
      take: this.rows,
      ...this.formSearch.value,
    };

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

      // Reset
      for (let key in this.sortStates) {
        if (key !== field) this.sortStates[key] = 0;
      }

      if (this.sortStates[field] === 1) {
        this.sortBy = field;
        this.sortDirection = 'Ascending';
        payload.SortBy = this.sortBy;
        payload.SortDirection = this.sortDirection;
      } else if (this.sortStates[field] === -1) {
        this.sortBy = field;
        this.sortDirection = 'Descending';
        payload.SortBy = this.sortBy;
        payload.SortDirection = this.sortDirection;
      } else {
        // Reset
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

    this.unitService.getAllPaged(payload).subscribe({
      next: (response) => {
        this.units = response.data;

        this.totalItems = response.totalElements;
        this.first = event?.first || 0;
        this.last = Math.min(this.first + this.rows, this.totalItems);
        this.searchInProgress = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.errors
            ? error?.error?.errors[0]
            : 'Error performing operation',
        });
        this.searchInProgress = false;
      },
    });

    this.first = event?.first || this.first || 0;
  }

  searchClean() {
    this.formSearch.reset();
    this.searchUnits();
  }

  addUnit() {
    this.router.navigate(['/parameterization/units/new']);
  }

  openViewEditUnit(currentMode: string, unit: any) {
    switch (currentMode) {
      case 'view':
        this.router.navigate(['/parameterization/units', unit.id, 'view']);
        break;
      case 'edit':
        this.router.navigate(['/parameterization/units', unit.id, 'edit']);
        break;
      case 'editProcess':
        this.router.navigate(['/parameterization/units', unit.id, 'edit'], {
          queryParams: { activeIndex: 3 },
        });
        break;
      case 'editMaterialsServicesUnit':
        this.router.navigate(['/parameterization/units', unit.id, 'edit'], {
          queryParams: { activeIndex: 2 },
        });
        break;
    }
  }

  applyMask(number: string): string {
    return number
      .replace(/(\d{4})(\d{0,8})/, '$1/$2')
      .replace(/(\d{4}\/\d{8})(\d{0,8})/, '$1');
  }

  onProcessChange(event: string): void {
    if (event) {
      const processNumber = event.replace(/\D/g, '');
      this.formSearch
        .get('processNumber')
        ?.setValue(processNumber, { emitEvent: false });
    }
  }

  get processNumberVisual(): string {
    const value = this.formSearch.get('processNumber')?.value || '';
    return this.applyMask(value);
  }
}
