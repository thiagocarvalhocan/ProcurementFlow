import { HttpResponse } from '@angular/common/http';
import { MOCK_FEATURE_CATALOG } from './mock-api-database';
import {
  MockEntityEvent,
  MockPaginatedResult,
  MockProfile,
  MockRequestContext,
  MockUnit,
  MockUser,
} from './mock-api.models';

/** A serialized row keeps the English fields plus the legacy aliases. */
export type MockRow = Record<string, any>;

export const DEFAULT_PAGE_SIZE = 10;

export function ok(body: unknown, status = 200): HttpResponse<unknown> {
  return new HttpResponse({ status, body });
}

export function created(body: unknown): HttpResponse<unknown> {
  return ok(body, 201);
}

export function failure(
  status: number,
  message: string
): HttpResponse<unknown> {
  return new HttpResponse({ status, body: { message } });
}

export function toNumber(value: unknown): number | undefined {
  const parsed = Number(value);
  return value === null || value === undefined || value === '' || Number.isNaN(parsed)
    ? undefined
    : parsed;
}

export function pick(source: unknown, keys: string[]): any {
  if (!source || typeof source !== 'object') return undefined;

  const record = source as Record<string, any>;

  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }

  return undefined;
}

function matchesSearch(row: MockRow, term: string): boolean {
  return JSON.stringify(row).toLowerCase().includes(term);
}

function sortRows(rows: MockRow[], field: string, direction: string): MockRow[] {
  const factor = /^desc/i.test(direction) ? -1 : 1;

  return [...rows].sort((leftRow, rightRow) => {
    const left = leftRow[field];
    const right = rightRow[field];

    if (typeof left === 'number' && typeof right === 'number') {
      return (left - right) * factor;
    }

    if (typeof left === 'boolean' && typeof right === 'boolean') {
      return (Number(left) - Number(right)) * factor;
    }

    return String(left ?? '').localeCompare(String(right ?? '')) * factor;
  });
}

/**
 * Applies search, sorting and paging exactly like a REST backend would and
 * answers with both English and legacy pagination names.
 */
export function paginate(
  rows: MockRow[],
  context: MockRequestContext
): MockPaginatedResult<MockRow> {
  const search = String(
    context.params['searchString'] ??
      context.params['search'] ??
      context.params['q'] ??
      ''
  )
    .trim()
    .toLowerCase();

  const take =
    toNumber(context.params['take']) ??
    toNumber(context.params['pageSize']) ??
    DEFAULT_PAGE_SIZE;

  const page = toNumber(context.params['page']);
  const skip =
    page !== undefined
      ? page * take
      : toNumber(context.params['skip']) ?? 0;

  const sortBy = String(context.params['sortBy'] ?? context.params['sort'] ?? '');
  const direction = String(
    context.params['sortDirection'] ?? context.params['direction'] ?? 'Ascending'
  );

  const filtered = search ? rows.filter((row) => matchesSearch(row, search)) : rows;
  const sorted = sortBy ? sortRows(filtered, sortBy, direction) : filtered;
  const data = sorted.slice(skip, skip + take);
  const totalElements = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / take));

  return {
    data,
    totalElements,
    totalPages,
    pageNumber: Math.floor(skip / take) + 1,
    pageSize: take,
  };
}

export function serializeUnit(unit: MockUnit): MockRow {
  return {
    ...unit,
    unitName: unit.name,
  };
}

export function serializeUser(user: MockUser): MockRow {
  return {
    ...user,
    azureAdId: `00000000-0000-0000-0000-${String(user.id).padStart(12, '0')}`,
    employeeId: user.employeeId,
    name: user.name,
    jobTitle: user.jobTitle,
    assignment: user.unitName,
    phone: user.phone,
    isActive: user.isActive,
    unitId: user.unitId,
    profiles: user.profiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      description: profile.description ?? profile.name,
      text: profile.description ?? profile.name,
    })),
    profileNames: user.profiles.map((profile) => profile.name),
  };
}

export function serializeProfile(profile: MockProfile): MockRow {
  return {
    ...profile,
    profileId: profile.id,
    profileName: profile.name,
    profileText: profile.description,
    accessDeniedEmail: profile.accessDeniedEmail,
    allowEditing: profile.allowEditing,
    features: serializeProfileFeatures(profile),
  };
}

export function serializeProfileFeatures(profile: MockProfile): MockRow[] {
  const storedFeatures = Array.isArray(profile.features) ? profile.features : [];

  return MOCK_FEATURE_CATALOG.map((catalogFeature) => {
    const storedFeature = storedFeatures.find(
      (feature) => feature.id === catalogFeature.id
    );
    const featureIsActive = storedFeature?.isActive === true;

    return {
      id: catalogFeature.id,
      featureName: catalogFeature.name,
      code: catalogFeature.code,
      text: catalogFeature.name,
      isActive: featureIsActive,
      actions: catalogFeature.actions.map((action) => {
        const storedAction = storedFeature?.actions.find(
          (featureAction) => featureAction.id === action.id
        );
        const actionIsActive = storedAction?.isActive === true;

        return {
          id: action.id,
          code: action.code,
          action: action.description,
          description: action.description,
          isActive: actionIsActive,
          isChecked: actionIsActive,
          isDisabled: false,
          exclusiveFeatureId: null,
          value: `${catalogFeature.id}-${action.id}`,
        };
      }),
    };
  });
}

export function serializeFeatureForForm(profileFeatures: MockRow[]): MockRow[] {
  return profileFeatures.map((feature) => ({
    ...feature,
    text: feature['featureName'],
    isActive: false,
    actions: (feature['actions'] as MockRow[]).map((action) => ({
      ...action,
      isActive: false,
      isChecked: false,
    })),
  }));
}

export function serializeEvent(event: MockEntityEvent): MockRow {
  return {
    ...event,
    entity: event.entityName,
    entityId: event.entityId,
    action: event.action,
    description: event.action,
    responsibleName: event.userName,
    date: event.date,
    featureName: 'Administration',
    responsibleId: 1,
    editType: null,
  };
}
