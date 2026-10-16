import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IconCloseSquareComponent } from '../../components/icons/icon-close-square/icon-close-square.component';
import { IconSaveComponent } from '../../components/icons/icon-save/icon-save.component';
import { ProfileService } from '../../services/profile.service';
import { IconViewComponent } from '../../components/icons/icon-view/icon-view.component';
import { IconEdit2Component } from '../../components/icons/icon-edit2/icon-edit2.component';
import { FeatureActionService } from '../../services/feature-action.service';
import { IconAddSquareComponent } from '../../components/icons/icon-add-square/icon-add-square.component';
import { UserPermissionService } from '../../services/user-permission.service';
import { TooltipModule } from 'primeng/tooltip';
import { IconInformationComponent } from '../../components/icons/icon-information/icon-information.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { FeaturePayload } from '../../models/FeaturePayload';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { ProfileFeature } from '../../models/ProfileFeature';
import { ProfileBase } from '../../models/ProfileBase';
import { ProfilePayload } from '../../models/ProfilePayload';

type ProfileModalArgs =
  | { mode: 'add' }
  | { mode: 'edit' | 'view'; profile: ProfileBase };
@Component({
  selector: 'app-profile',
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
    InputSwitchModule,
    CheckboxModule,
    ReactiveFormsModule,
    DropdownModule,
    PaginatorModule,
    InputNumberModule,
    IconViewComponent,
    IconEdit2Component,
    IconFieldModule,
    InputIconModule,
    IconAddSquareComponent,
    TooltipModule,
    IconInformationComponent,
    SearchInputComponent,
    PaginatorComponent,
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  @ViewChild('tb') tb!: Table;

  showInputEmail = false;
  searchInProgress = false;
  profileModalVisibility: boolean = false;
  visibleCancelConfirm: boolean = false;
  visibleConfirmSave: boolean = false;

  first: number = 0;
  last = <number>4;
  rows: number = 10;
  totalItems = <number>0;
  currentPage: number = 0;

  sortBy = <string>'';
  sortDirection = <string>'';
  profileModalMode: 'edit' | 'add' | 'view' = 'add';

  sortStates: { [key: string]: number } = {};
  options = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
  ];
  profileFeatureActions: ProfileBase[] = [];
  selectedProfile: ProfileFeature[] = [];
  profileTableHeaders = [
    { title: 'Profile', key: 'name' },
    { title: 'Profile description', key: 'description' },
    { title: 'Permissions', key: '' },
  ];

  form!: FormGroup;
  formSearch: FormGroup;

  private featureActionsFormAdd: ProfileFeature[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private service: ProfileService,
    private messageService: MessageService,
    private featureActionService: FeatureActionService,
    public userPermissionService: UserPermissionService,
  ) {
    this.featureActionService.getAllToFormNewProfile().subscribe({
      next: (response) => {
        this.featureActionsFormAdd = response;
      },
    });

    this.form = this.formBuilder.group({
      id: [null],
      profile: ['', Validators.required],
      text: ['', Validators.required],
      accessDeniedEmail: [''],
    });
    this.formSearch = this.formBuilder.group({
      searchTerm: [''],
    });
  }

  ngOnInit() {}

  onRowsChange(newRows: number): void {
    this.rows = newRows;
    this.first = 0;
    this.getProfileFeatureActions();
  }

  getProfileFeatureActions(event?: any) {
    if (this.searchInProgress) return;
    this.searchInProgress = true;

    const payload: ProfilePayload = {
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

    this.service.getAllPaged(payload).subscribe({
      next: (response) => {
        this.profileFeatureActions = response.data;

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

  getFeaturesInline(features: ProfileFeature[]) {
    return features
      ?.filter(
        (featureName) =>
          featureName.actions?.filter((action) => action.isActive)?.length > 0,
      )
      ?.map((featureName) => featureName.featureName)
      .join('; ');
  }

  searchProfilesByKeyword() {
    if (this.formSearch.valid === false) return;

    this.getProfileFeatureActions();
  }

  getActiveFeaturesAndActions(data: ProfileFeature[]) {
    const activeFeatures = data.filter(
      (featureName) => featureName.isActive,
    );

    if (!activeFeatures.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a feature.',
      });
      return null;
    }

    const featuresWithActions: FeaturePayload[] = [];

    for (const featureName of activeFeatures) {
      const activeActions = featureName.actions
        ?.filter((action) => action.isActive)
        ?.map((action) => action.id);

      if (!activeActions || activeActions.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Please select an action for the feature "${featureName.featureName}".`,
        });
        return null;
      }

      featuresWithActions.push({
        featureId: featureName.id,
        actions: activeActions,
      });
    }

    return featuresWithActions;
  }

  openProfileModal(args: ProfileModalArgs) {
    const { mode } = args;

    this.form.reset();
    this.form.enable();
    this.profileModalMode = mode;
    this.profileModalVisibility = true;

    if (mode === 'edit' || mode === 'view') {
      const profile = args.profile;console.log(this.selectedProfile)
      this.selectedProfile =
        this.profileFeatureActions.find(
          (pfa) => pfa.profileId == profile.profileId,
        )?.features ?? [];

      this.form.get('id')?.setValue(profile.profileId);
      this.form.get('profile')?.setValue(profile.profileName);
      this.form.get('text')?.setValue(profile.profileText);
      this.form
        .get('accessDeniedEmail')
        ?.setValue(profile.accessDeniedEmail);

      this.verifyShowInputEmail(profile.profileName);

      if (mode === 'view') this.form.disable();
    } else {
      this.verifyShowInputEmail('');
      this.selectedProfile = JSON.parse(
        JSON.stringify(this.featureActionsFormAdd),
      );
    }
  }

  closeProfileModal() {
    this.profileModalVisibility = false;
  }

  confirmSave() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required field(s).',
      });
      return;
    }

    const validatedFeatures = this.getActiveFeaturesAndActions(
      this.selectedProfile,
    );

    if (!validatedFeatures) {
      return;
    }

    const accessDeniedEmail = this.form
      .get('accessDeniedEmail')
      ?.value?.trim();

    if (
      this.form.get('profile')?.value == null ||
      this.form.get('profile')?.value?.trim() == '' ||
      (this.showInputEmail &&
        (accessDeniedEmail == undefined || accessDeniedEmail == ''))
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required field(s).',
      });
      return;
    }

    this.visibleConfirmSave = true;
  }

  saveOrEdit() {
    this.form.get('id')?.value ? this.edit() : this.save();
  }

  closeSaveConfirm() {
    this.profileModalVisibility = false;
    this.visibleConfirmSave = false;
  }

  getModalTitle() {
    let title = 'View';

    if (this.profileModalMode == 'add') title = 'Add';
    else if (this.profileModalMode == 'edit') title = 'Edit';

    return title + ' Profile';
  }

  verifyShowInputEmail(eventOrValue: KeyboardEvent | string) {
    let value: string;

    if (typeof eventOrValue === 'string') {
      value = eventOrValue;
    } else {
      const input = eventOrValue.target as HTMLInputElement;
      value = input?.value ?? '';
    }

    this.showInputEmail = value.toLowerCase().includes('administrador');
  }

  save() {
    const payload = {
      description: this.form.get('profile')?.value,
      text: this.form.get('text')?.value,
      accessDeniedEmail: this.form.get('accessDeniedEmail')?.value,
      features: this.getActiveFeaturesAndActions(
        this.selectedProfile,
      ),
    };
    this.service.insert(payload).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile created successfully',
        });
        this.getProfileFeatureActions();
        this.closeSaveConfirm();
      },
      error: (response) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            response.error?.errors[0] || 'Error while creating the profile',
        });
      },
    });
  }

  edit() {
    const payload = {
      id: this.form.get('id')?.value,
      description: this.form.get('profile')?.value,
      text: this.form.get('text')?.value,
      accessDeniedEmail: this.form.get('accessDeniedEmail')?.value,
      features: this.getActiveFeaturesAndActions(
        this.selectedProfile,
      ),
    };
    this.service.update(payload).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully',
        });
        this.getProfileFeatureActions();
        this.closeSaveConfirm();
      },
      error: (response) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            response.error?.errors[0] || 'Error while editing the profile',
        });
      },
    });
  }

  onToggleFeature(featureName: ProfileFeature) {
    const viewAction = featureName.actions?.find((action) => action.id === 1);
    if (viewAction) {
      viewAction.isActive = featureName.isActive;

      if ('isChecked' in viewAction) {
        viewAction.isChecked = featureName.isActive;
      }
    }
  }

  closeCancelConfirm() {
    this.visibleCancelConfirm = false;
    this.profileModalVisibility = false;
    this.form.reset();

    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: `No profile ${
        this.profileModalMode == 'add' ? ' was created.' : ' was edited.'
      }`,
    });
  }
}
