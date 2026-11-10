import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button, ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { IconUnlinkComponent } from '../../../../components/icons/icon-unlink/icon-unlink.component';
import { IconSaveComponent } from '../../../../components/icons/icon-save/icon-save.component';
import { IconLinkComponent as IconLinkComponent } from '../../../../components/icons/icon-link/icon-link.component';
import { CostCenter } from '../../../../models/CostCenter';
import { RAJ } from '../../../../models/RAJ';
import { CostCenterService } from '../../../../services/cost-center.service';
import { RajService } from '../../../../services/raj.service';
import { UnitService } from '../../../../services/unit.service';
import { UserPermissionService } from '../../../../services/user-permission.service';
import { TooltipModule } from 'primeng/tooltip';
import { UnitResponse } from '../../../../models/response/UnitResponse';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-unit',
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
    InputTextModule,
    RouterModule,
    DropdownModule,
    TooltipModule,
    IconLinkComponent,
    IconUnlinkComponent,
    ToastModule,
    IconSaveComponent,
    PaginatorModule,
    PaginatorComponent,
  ],
  providers: [MessageService],
  templateUrl: './unit.component.html',
  styleUrl: './unit.component.scss',
})
export class UnitComponent {
  sortStates: { [key: string]: number } = {};
  @ViewChild('tb') tb!: Table;

  costCenterOriginal: UnitResponse[];
  form: FormGroup;
  formUnlink: FormGroup;
  searchInProgress = false;
  modalConfirmMode: 'link' | 'unlink' = 'link';
  mode: 'view' | 'edit' | 'new' = 'new';
  isVisibleConfirmSave: boolean = false;
  isVisibleConfirmLinkUnlink: boolean = false;
  values: UnitResponse[];

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

  rajs: RAJ[] | undefined;
  costCenters: CostCenter[] | undefined;
  costCentersPaginated: CostCenter[] = [];
  unitId: number | null = null;

  headersTableCostCenters = [
    { title: 'Code', key: 'id' },
    { title: 'Descrition', key: 'description' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public userPermissionService: UserPermissionService,
    private rajService: RajService,
    private costCenterService: CostCenterService,
    private unitService: UnitService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
  ) {
    const unit = this.activatedRoute.snapshot.data['unit'];
    const url = this.router.url;
    this.mode = url.includes('view')
      ? 'view'
      : url.includes('edit')
        ? 'edit'
        : 'new';
    if (this.mode != 'new') {
      this.unitId = unit.id;
    }

    this.form = this.formBuilder.group({
      id: [null],
      sofUnitDescription: [null, Validators.required],
      rajId: [null, Validators.required],
      centersCost: [null],
      descriptionRaj: [null],
      nameUserOwnerUnit: [null],
      processNumber: [null],
    });

    this.form.patchValue(unit);
    this.values = this.form.get('centersCost')?.value;
    this.costCenterOriginal = this.values;

    if (this.mode == 'view') {
      this.form.disable();
    }

    this.formUnlink = this.formBuilder.group({
      unlinkReason: ['', Validators.required],
      costCenter: [null, Validators.required],
    });

    if (!this.form.get('id')?.value) {
      this.formUnlink.controls['costCenter'].disable();
    } else {
      this.formUnlink.controls['costCenter'].enable();
    }

    this.getRajs();
    this.getCostCenters();
  }

  getRajs() {
    this.rajService.getRajs().subscribe({
      next: (response) => {
        this.rajs = response;
      },
    });
  }

  getCostCenters() {
    this.costCenterService.getCostsCenter().subscribe({
      next: (response) => {
        this.costCenters = response;
      },
    });
  }

  onRowsChange(newRows: number): void {
    this.rows = newRows;
    this.first = 0;
    this.search();
  }

  search(event?: any) {
    if (!this.values) return;
    if (this.searchInProgress) return;
    this.searchInProgress = true;

    const payload: any = {
      skip: 0,
      take: this.rows,
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

      // Reset sorting
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

    this.unitService.getCentersCostByUnit(this.unitId, payload).subscribe({
      next: (response) => {
        this.costCentersPaginated = response.data;

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
  }

  openConfirmSaveUnit() {
    this.isVisibleConfirmSave = true;
  }

  openConfirmUnlink(costCenter: number) {
    this.formUnlink.get('costCenter')?.setValue(costCenter);
    this.modalConfirmMode = 'unlink';
    this.isVisibleConfirmLinkUnlink = true;
  }

  saveOrEditUnit() {
    this.isVisibleConfirmSave = false;
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required field(s).',
      });
      return;
    }

    if (this.form.get('id')?.value) {
      this.unitService.update(this.form.value).subscribe({
        next: (response) => {
          this.form.patchValue(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Unit salva com success',
          });
          this.sortStates = {};
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.errors[0] || 'Error ao save unit',
          });
        },
      });
    } else {
      this.unitService.save(this.form.value).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Unit salva com success',
          });
          this.form.patchValue(response);
          setTimeout(() => {
            this.router.navigate([`administration/units`]);
          }, 1500);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.errors[0] || 'Error ao save unit',
          });
        },
      });
    }
  }

  openConfirmLink() {
    this.modalConfirmMode = 'link';
    this.isVisibleConfirmLinkUnlink = true;
  }

  closeConfirmLinkUnlink() {
    this.modalConfirmMode = 'link';
    this.isVisibleConfirmLinkUnlink = false;
  }

  linkCostCenter() {
    this.isVisibleConfirmLinkUnlink = false;

    this.formUnlink.markAllAsTouched();

    this.unitService
      .link(
        this.form.get('id')?.value,
        this.formUnlink.get('costCenter')?.value,
      )
      .subscribe({
        next: (response) => {
          const centersCost = this.form.get('centersCost')?.value;
          centersCost.push(
            this.costCenters?.find(
              (item) => item.id == this.formUnlink.get('costCenter')?.value,
            ),
          );
          this.form.get('centersCost')?.setValue(centersCost);
          this.search();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Center de cost vinculado com success',
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.errors[0] || 'Error ao link center de cost',
          });
        },
      });
  }

  unlinkCostCenter() {
    this.formUnlink.markAllAsTouched();
    if (!this.formUnlink.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required field(s).',
      });
      return;
    }
    this.isVisibleConfirmLinkUnlink = false;

    this.unitService
      .unlink(
        this.form.get('id')?.value,
        this.formUnlink.get('costCenter')?.value,
      )
      .subscribe({
        next: (response) => {
          const costCenter = this.formUnlink.get('costCenter')?.value;
          const centersCost = this.form.get('centersCost')?.value;
          this.form
            .get('centersCost')
            ?.setValue(
              centersCost.filter((item: CostCenter) => item.id != costCenter),
            );
          this.search();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Center de cost desvinculado com success',
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.errors[0] || 'Error ao unlink center de cost',
          });
        },
      });
    this.modalConfirmMode = 'link';
  }
}
