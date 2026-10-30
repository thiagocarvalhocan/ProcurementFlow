import { HttpResponse } from '@angular/common/http';
import {
  MOCK_EVENTS,
  MOCK_FEATURE_CATALOG,
  MOCK_PROFILES,
  MOCK_UNITS,
  MOCK_USERS,
  nextMockId,
} from './mock-api-database';
import {
  MockEntityEvent,
  MockProfile,
  MockProfileSummary,
  MockRequestContext,
  MockUser,
} from './mock-api.models';
import {
  MockRow,
  created,
  failure,
  ok,
  paginate,
  pick,
  serializeEvent,
  serializeFeatureForForm,
  serializeProfile,
  serializeProfileFeatures,
  serializeUnit,
  serializeUser,
  toNumber,
} from './mock-api.serializers';

const STORAGE_PREFIX = 'procurementflow_mock_';

const nowIso = (): string => new Date().toISOString();

function loadPersisted<T>(name: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + name);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as unknown as T;
    return fallback;
  } catch {
    return fallback;
  }
}

function persist(name: string, value: unknown): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(value));
  } catch {
  }
}

const normalize = (value: string | undefined): string =>
  (value ?? '').toLowerCase();


/**
 * Removes the origin and the `/api` prefix and returns only the resource
 * path (`/api/user/10` becomes `/user/10`).
 */
export function extractMockPath(url: string): string {
  const withoutOrigin = url.replace(/^https?:\/\/[^/]+/i, '');
  const withoutQuery = withoutOrigin.split('?')[0];
  const match = /^\/?api(\/.*)?$/i.exec(withoutQuery);

  if (match) {
    return match[1] ?? '';
  }



  // Legacy base URLs were built without the separating slash
  // (`/api` + `page-access/leave`); they still have to be answered locally.
  const merged = /^\/api([^/?]+)/i.exec(withoutQuery);

  return merged ? merged[1] : '';
}

export function isMockApiUrl(url: string): boolean {
  const withoutOrigin = url.replace(/^https?:\/\/[^/]+/i, '');

  return /^\/?api/i.test(withoutOrigin.split('?')[0]);
}

export function buildMockRequestContext(request: {
  method: string;
  url: string;
  body?: unknown;
}): MockRequestContext {
  const queryIndex = request.url.indexOf('?');
  const search = queryIndex >= 0 ? request.url.slice(queryIndex + 1) : '';
  const params: Record<string, string> = {};

  new URLSearchParams(search).forEach((value, key) => {
    params[key] = value;
  });

  return {
    method: request.method.toLowerCase(),
    path: extractMockPath(request.url),
    params,
    body: request.body ?? null,
  };
}

export function handleMockApiRequest(
  context: MockRequestContext,
): HttpResponse<unknown> {
  const segments = context.path.split('/').filter(Boolean);
  const resource = normalize(segments[0]);

  switch (resource) {
    case 'user':
    case 'users':
      return handleUsers(context, segments);
    case 'profile':
    case 'profiles':
      return handleProfiles(context, segments);
    case 'unit':
    case 'units':
      return handleUnits(context, segments);
    case 'featureaction':
    case 'feature-action':
    case 'feature-actions':
    case 'features':
      return handleFeatureCatalog(context, segments);
    case 'entityevent':
    case 'entity-event':
    case 'event':
    case 'events':
      return handleEvents(context, segments);
    case 'advance-request':
    case 'advancerequest':
      return handleAdvanceRequests(context, segments);
    case 'advance-request-message':
    case 'advancerequestmessage':
      return handleAdvanceRequestMessages(context, segments);
    case 'expensetype':
      return handleExpenseTypes(context, segments);
    case 'month':
      return handleMonths(context, segments);
    default:
      return handleFallback(context, segments);
  }
}

function handleUsers(
  context: MockRequestContext,
  segments: string[],
): HttpResponse<unknown> {
  const action = normalize(segments[1]);

  if (context.method === 'get') {
    if (action === 'paginated' || action === 'paged') {
      return ok(paginate(MOCK_USERS.map(serializeUser), context));
    }

    if (action === 'accountant' || action === 'accountants') {
      return ok(
        MOCK_USERS.filter((user) => user.isActive)
          .slice(0, 6)
          .map(serializeUser),
      );
    }

    if (action === 'export-excel' || action === 'export') {
      return excelResponse();
    }

    if (action === 'authenticated') {
      const current =
        MOCK_USERS.find((user) => user.id === context.currentUser?.id) ??
        MOCK_USERS[0];

      return ok(serializeUser(current));
    }

    if (
      action === 'directory-users' ||
      action === 'ad-users' ||
      action === 'by-name'
    ) {
      return ok(searchDirectory(segments[2]));
    }

    const found = MOCK_USERS.find((user) => user.id === toNumber(segments[1]));

    return found
      ? ok(serializeUser(found))
      : failure(404, `User ${segments[1]} was not found`);
  }

  if (context.method === 'post') {
    return created(serializeUser(createUser(context.body)));
  }

  if (context.method === 'put') {
    const updated = updateUser(
      toNumber(segments[1]) ?? toNumber(pick(context.body, ['id'])),
      context.body,
    );

    return updated
      ? ok(serializeUser(updated))
      : failure(404, `User ${segments[1]} was not found`);
  }

  if (context.method === 'patch' || context.method === 'delete') {
    const target = MOCK_USERS.find((user) => user.id === toNumber(segments[1]));

    if (!target) {
      return failure(404, `User ${segments[1]} was not found`);
    }

    const subAction = normalize(segments[2]);
    const enable = subAction === 'activate' || subAction === 'enable';

    target.isActive =
      context.method === 'delete'
        ? false
        : subAction === 'deactivate' || subAction === 'disable'
          ? false
          : enable;
    target.updatedAt = nowIso();
    registerEvent(
      'User',
      target.id,
      target.isActive ? 'Record enabled' : 'Record disabled',
    );
    persist('users_v1', MOCK_USERS);

    return ok(serializeUser(target));
  }

  return failure(
    405,
    `${context.method.toUpperCase()} is not supported for users`,
  );
}

function searchDirectory(term: string | undefined): MockRow[] {
  const needle = normalize(term);

  if (!needle) return [];

  return MOCK_USERS.filter((user) =>
    [user.name, user.email, user.employeeId]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  )
    .slice(0, 10)
    .map(serializeUser);
}

function excelResponse(): HttpResponse<unknown> {
  const header = 'Employee ID,Name,Job title,E-mail,Unit,Status';
  const rows = MOCK_USERS.map(
    (user) =>
      `${user.employeeId},${user.name},${user.jobTitle},${user.email},${user.unitName},${user.isActive ? 'Active' : 'Inactive'}`,
  );

  return new HttpResponse({
    status: 200,
    body: new Blob([[header, ...rows].join('\n')], { type: 'text/csv' }),
  });
}

function toProfileSummaries(source: unknown): MockProfileSummary[] {
  if (!Array.isArray(source)) return [];

  return source
    .map((item) => {
      const id = toNumber(pick(item, ['id'])) ?? toNumber(item);

      if (id === undefined) return undefined;

      const known = MOCK_PROFILES.find((profile) => profile.id === id);

      return {
        id,
        name: String(
          pick(item, ['description', 'name', 'text']) ?? known?.name ?? '',
        ),
      };
    })
    .filter((profile): profile is MockProfileSummary => profile !== undefined);
}

function createUser(body: unknown): MockUser {
  const unitId = toNumber(pick(body, ['unitId'])) ?? MOCK_UNITS[0].id;
  const unit = MOCK_UNITS.find((item) => item.id === unitId);
  const active = pick(body, ['isActive']);

  const user: MockUser = {
    id: nextMockId(MOCK_USERS),
    name: String(pick(body, ['name']) ?? 'New team member'),
    email: String(pick(body, ['email']) ?? ''),
    employeeId: String(
      pick(body, ['employeeId']) ?? nextMockId(MOCK_USERS) + 399999,
    ),
    jobTitle: String(pick(body, ['jobTitle']) ?? 'Procurement Analyst'),
    phone: String(pick(body, ['phone']) ?? ''),
    isActive: active === undefined ? true : Boolean(active),
    unitId,
    unitName: unit?.name ?? 'Procurement Demo Unit',
    profiles: toProfileSummaries(pick(body, ['profiles'])),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  MOCK_USERS.push(user);
  registerEvent('User', user.id, 'Record created');
  persist('users_v1', MOCK_USERS);

  return user;
}

function updateUser(
  id: number | undefined,
  body: unknown,
): MockUser | undefined {
  const target = MOCK_USERS.find((user) => user.id === id);

  if (!target) return undefined;

  const unitId = toNumber(pick(body, ['unitId']));
  const unit = unitId
    ? MOCK_UNITS.find((item) => item.id === unitId)
    : undefined;
  const active = pick(body, ['isActive']);

  target.name = String(pick(body, ['name']) ?? target.name);
  target.email = String(pick(body, ['email']) ?? target.email);
  target.employeeId = String(pick(body, ['employeeId']) ?? target.employeeId);
  target.jobTitle = String(pick(body, ['jobTitle']) ?? target.jobTitle);
  target.phone = String(pick(body, ['phone']) ?? target.phone);
  target.isActive = active === undefined ? target.isActive : Boolean(active);

  if (unit) {
    target.unitId = unit.id;
    target.unitName = unit.name;
  }

  const profiles = toProfileSummaries(pick(body, ['profiles']));

  if (profiles.length > 0) {
    target.profiles = profiles;
  }

  target.updatedAt = nowIso();
  registerEvent('User', target.id, 'Record updated');
  persist('users_v1', MOCK_USERS);

  return target;
}

function registerEvent(
  entityName: string,
  entityId: number,
  action: string,
): MockEntityEvent {
  const event: MockEntityEvent = {
    id: nextMockId(MOCK_EVENTS),
    entityName,
    entityId,
    action,
    userName: 'Mock API',
    date: nowIso(),
  };

  MOCK_EVENTS.push(event);

  persist('events_v1', MOCK_EVENTS);

  return event;
}

function handleProfiles(
  context: MockRequestContext,
  segments: string[],
): HttpResponse<unknown> {
  const action = normalize(segments[1]);

  if (context.method === 'get') {
    if (action === 'paginated' || action === 'paged') {
      return ok(paginate(MOCK_PROFILES.map(serializeProfile), context));
    }

    if (!action) {
      return ok(
        MOCK_PROFILES.map((profile) => ({
          id: profile.id,
          name: profile.name,
          description: profile.description,
          text: profile.description,
        })),
      );
    }

    const found = MOCK_PROFILES.find(
      (profile) => profile.id === toNumber(segments[1]),
    );

    return found
      ? ok(serializeProfile(found))
      : failure(404, `Profile ${segments[1]} was not found`);
  }

  if (context.method === 'post' || context.method === 'put') {
    const id =
      context.method === 'put'
        ? (toNumber(segments[1]) ?? toNumber(pick(context.body, ['id'])))
        : undefined;
    const existing = MOCK_PROFILES.find((profile) => profile.id === id);
    const features = mapPayloadFeatures(context.body);
    const name = String(
      pick(context.body, ['profileName', 'name', 'description']) ??
        'New profile',
    );
    const description = String(
      pick(context.body, ['profileText', 'text', 'description']) ?? '',
    );
    const accessDeniedEmail = String(
      pick(context.body, ['accessDeniedEmail']) ??
        'support@procurementflow.demo',
    );

    if (existing) {
      existing.name = name;
      existing.description = description;
      existing.accessDeniedEmail = accessDeniedEmail;
      existing.features = features;
      existing.updatedAt = nowIso();
      registerEvent('Profile', existing.id, 'Record updated');
      persist('profiles_v1', MOCK_PROFILES);

      return ok(serializeProfile(existing));
    }

    const profile: MockProfile = {
      id: nextMockId(MOCK_PROFILES),
      name,
      description,
      accessDeniedEmail,
      allowEditing: true,
      features,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    MOCK_PROFILES.push(profile);
    registerEvent('Profile', profile.id, 'Record created');
    persist('profiles_v1', MOCK_PROFILES);

    return context.method === 'post'
      ? created(serializeProfile(profile))
      : ok(serializeProfile(profile));
  }

  return failure(
    405,
    `${context.method.toUpperCase()} is not supported for profiles`,
  );
}

function mapPayloadFeatures(body: unknown): MockProfile['features'] {
  const items = pick(body, ['features']);
  const hasPayloadFeatures = Array.isArray(items) && items.length > 0;
  const grantedActionIds = new Map<number, Set<number>>();

  if (hasPayloadFeatures) {
    for (const item of items) {
      const featureId = toNumber(pick(item, ['featureId', 'id']));

      if (!featureId) continue;

      const requestedActions = pick(item, ['actions']);
      const actionIds = new Set<number>();

      if (Array.isArray(requestedActions)) {
        for (const requestedAction of requestedActions) {
          const numericId = toNumber(requestedAction);

          if (numericId !== undefined) {
            actionIds.add(numericId);
            continue;
          }

          const requestedCode = normalize(
            String(pick(requestedAction, ['code']) ?? ''),
          );
          const catalogFeature = MOCK_FEATURE_CATALOG.find(
            (feature) => feature.id === featureId,
          );
          const catalogAction = catalogFeature?.actions.find(
            (action) => normalize(action.code) === requestedCode,
          );

          if (catalogAction) actionIds.add(catalogAction.id);
        }
      }

      grantedActionIds.set(featureId, actionIds);
    }
  }

  return MOCK_FEATURE_CATALOG.map((feature) => {
    const featureGranted =
      !hasPayloadFeatures || grantedActionIds.has(feature.id);
    const granted = grantedActionIds.get(feature.id);
    const grantEveryAction = granted === undefined || granted.size === 0;

    return {
      id: feature.id,
      name: feature.name,
      code: feature.code,
      isActive: featureGranted,
      actions: feature.actions.map((action) => ({
        ...action,
        isActive:
          featureGranted &&
          (grantEveryAction || granted?.has(action.id) === true),
      })),
    };
  });
}

function handleFeatureCatalog(
  context: MockRequestContext,
  segments: string[],
): HttpResponse<unknown> {
  if (context.method !== 'get') {
    return failure(
      405,
      `${context.method.toUpperCase()} is not supported for the feature catalogue`,
    );
  }

  const catalogue = segments[1] ?? '';
  const pseudoProfile = {
    features: MOCK_FEATURE_CATALOG,
  } as unknown as MockProfile;

  if (catalogue === 'form-new-profile' || normalize(catalogue) === 'form') {
    return ok(serializeFeatureForForm(serializeProfileFeatures(pseudoProfile)));
  }

  return ok(serializeProfileFeatures(pseudoProfile));
}

function handleUnits(
  context: MockRequestContext,
  segments: string[],
): HttpResponse<unknown> {
  if (context.method !== 'get') {
    return failure(
      405,
      `${context.method.toUpperCase()} is not supported for units`,
    );
  }

  const direction =
    context.params['sortDirection'] ?? context.params['direction'];
  const descending =
    direction !== undefined &&
    (direction === '-1' || normalize(direction).startsWith('desc'));

  const units = [...MOCK_UNITS].sort((left, right) =>
    descending
      ? right.name.localeCompare(left.name)
      : left.name.localeCompare(right.name),
  );

  if (segments[1]) {
    const found = units.find((unit) => unit.id === toNumber(segments[1]));

    return found
      ? ok(serializeUnit(found))
      : failure(404, `Unit ${segments[1]} was not found`);
  }

  return ok(units.map(serializeUnit));
}

function handleEvents(
  context: MockRequestContext,
  segments: string[],
): HttpResponse<unknown> {
  if (context.method !== 'get') {
    return failure(
      405,
      `${context.method.toUpperCase()} is not supported for events`,
    );
  }

  const entityId = toNumber(segments[2]);

  if (entityId === undefined) {
    return ok(MOCK_EVENTS.map(serializeEvent));
  }

  return ok(
    MOCK_EVENTS.filter((event) => event.entityId === entityId).map(
      serializeEvent,
    ),
  );
}

function handleExpenseTypes(
  context: MockRequestContext,
  segments: string[],
): HttpResponse<unknown> {
  return ok([
    { id: 1, description: 'Monthly' },
    { id: 2, description: 'Occasional' },
  ]);
}

function handleMonths(
  context: MockRequestContext,
  segments: string[],
): HttpResponse<unknown> {
  return ok([
    { id: 1, description: 'January' },
    { id: 2, description: 'February' },
    { id: 3, description: 'March' },
  ]);
}

function buildMonthRows(months?: any[]): any[] {
  const source =
    months && months.length
      ? months
      : Array.from({ length: 12 }, (_, index) => ({
          monthId: index + 1,
          description: new Date(2025, index, 1).toLocaleString('en-US', {
            month: 'long',
          }),
          requested: false,
          isFieldDisabled: false,
        }));

  return source.map((month: any, index: number) => ({
    advanceRequestMonthId: month.advanceRequestMonthId ?? index + 1,
    advanceRequestId: month.advanceRequestId ?? 0,
    processId: month.processId ?? 1,
    unitId: month.unitId ?? 1003072,
    processNumber: month.processNumber ?? 'PR-001',
    integrationId: month.integrationId ?? 1,
    accountantName: month.accountantName ?? 'Accountant',
    monthId: month.monthId ?? index + 1,
    description: month.description ?? '',
    requested: !!month.requested,
    isFieldDisabled: !!month.isFieldDisabled,
    budgetTypeId: month.budgetTypeId ?? 1,
    budgetTypeDescription: month.budgetTypeDescription ?? 'Monthly',
    budgetValue: month.budgetValue ?? 1000,
    requestMonthStatusId: month.requestMonthStatusId ?? 1,
    requestMonthStatusDescription:
      month.requestMonthStatusDescription ?? 'Approved',
    statusChangeReason: month.statusChangeReason ?? null,
    linkedProcessId: month.linkedProcessId ?? null,
    accountantUserId: month.accountantUserId ?? 1,
    idRequisicaoAdiantamentoMes:
      month.idRequisicaoAdiantamentoMes ?? index + 1,
    idRequisicaoAdiantamento: month.idRequisicaoAdiantamento ?? 0,
  }));
}

function buildAdvanceRequestRow(id: number, payload?: any): any {
  const months = buildMonthRows(payload?.months);
  const selectedMonths = (payload?.months ?? []).filter(
    (month: any) => month.requested,
  );
  const requestedMonths = selectedMonths
    .map((month: any) => month.description)
    .join(', ');

  return {
    id,
    unitId: payload?.unitId ?? 1003072,
    unitDescription: payload?.unitDescription ?? 'Procurement Demo Unit',
    budgetTypeIds: payload?.budgetTypeIds ?? 1,
    budgetTypeDescription: payload?.budgetTypeDescription ?? 'Monthly',
    year: payload?.year ?? new Date().getFullYear(),
    requestedMonths,
    lastUpdatedDate: new Date().toISOString(),
    dataUltimaAtualizacao: new Date().toISOString(),
    budgetValue: payload?.budgetValue ?? 1000,
    message: payload?.message ?? '<p>Advance request message</p>',
    months,
  };
}

const MOCK_ADVANCE_REQUESTS: any[] = loadPersisted(
  'advance_requests_v1',
  [buildAdvanceRequestRow(1)],
);

function handleAdvanceRequests(
  context: MockRequestContext,
  segments: string[],
): HttpResponse<unknown> {
  const action = normalize(segments[1]);

  if (context.method === 'get') {
    if (action === 'validation-start-registration') return ok(true);
    if (action === 'validation-monthly-request')
      return ok(buildAdvanceRequestRow(1));
    if (action === 'months-initial-value') return ok(0);

    if (segments[2] === 'months') {
      const target = MOCK_ADVANCE_REQUESTS.find(
        (request) => request.id === toNumber(segments[1]),
      );
      return ok(target ? target.months : []);
    }

    if (!Number.isNaN(Number(action)) && action) {
      const target = MOCK_ADVANCE_REQUESTS.find(
        (request) => request.id === toNumber(action),
      );
      return target ? ok({ ...target }) : failure(404, 'Advance request not found');
    }

    let filtered = MOCK_ADVANCE_REQUESTS.slice();

    const requestYear = context.params['requestYear'];
    if (requestYear) {
      filtered = filtered.filter(
        (request) => request.year === Number(requestYear),
      );
    }

    const budgetTypeId = context.params['budgetTypeId'];
    if (budgetTypeId) {
      filtered = filtered.filter(
        (request) => request.budgetTypeIds === Number(budgetTypeId),
      );
    }

    const rawSearch = context.params['searchString'] ?? '';
    const searchString =
      rawSearch === 'null' || rawSearch === 'undefined' ? '' : rawSearch;
    const needle = searchString.trim().toLowerCase();
    if (needle) {
      filtered = filtered.filter((request) =>
        [request.unitDescription, request.budgetTypeDescription, request.requestedMonths]
          .join(' ')
          .toLowerCase()
          .includes(needle),
      );
    }

    const skip = Number(context.params['skip'] ?? 0);
    const take = Number(context.params['take'] ?? filtered.length);
    const page = filtered.slice(skip, skip + take);

    return ok({
      data: page.map((request) => ({ ...request })),
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / (take || 1))),
    });
  }

  if (context.method === 'post') {
    const created = buildAdvanceRequestRow(
      MOCK_ADVANCE_REQUESTS.reduce(
        (max, request) => Math.max(max, request.id),
        0,
      ) + 1,
      context.body,
    );
    created.id = created.id;
    MOCK_ADVANCE_REQUESTS.push(created);
    persist('advance_requests_v1', MOCK_ADVANCE_REQUESTS);
    return ok({ ...created });
  }

  if (context.method === 'put' || context.method === 'patch') {
    const target = MOCK_ADVANCE_REQUESTS.find(
      (request) => request.id === toNumber(segments[1]),
    );
    if (!target) return failure(404, 'Advance request not found');
    const updated = buildAdvanceRequestRow(target.id, context.body);
    updated.id = target.id;
    const index = MOCK_ADVANCE_REQUESTS.indexOf(target);
    MOCK_ADVANCE_REQUESTS[index] = updated;
    persist('advance_requests_v1', MOCK_ADVANCE_REQUESTS);
    return ok({ ...updated });
  }

  return ok({});
}

const MOCK_MESSAGES: any[] = loadPersisted('messages_v1', [
  {
    active: true,
    endDate: '2025-12-31',
    startDate: '2025-01-01',
    description: '<p>Sample request message</p>',
    id: 1,
    specificMonth: 'January',
    specificMonthId: 1,
    messageType: 'Fixed',
    messageTypeId: 1,
    descricao: '<p>Sample request message</p>',
    dataInicio: '2025-01-01',
    dataFim: '2025-12-31',
    mesEspecificoId: 1,
  },
  {
    active: true,
    endDate: '2025-12-31',
    startDate: '2025-01-01',
    description: '<p>Sample dynamic message</p>',
    id: 2,
    specificMonth: 'February',
    specificMonthId: 2,
    messageType: 'Dynamic',
    messageTypeId: 2,
    descricao: '<p>Sample dynamic message</p>',
    dataInicio: '2025-01-01',
    dataFim: '2025-12-31',
    mesEspecificoId: 2,
  },
]);

function toMessageId(value: any): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') {
    if (value.code !== undefined) return Number(value.code);
    if (value.id !== undefined) return Number(value.id);
  }
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function buildMessageRow(id: number, payload?: any, fallback?: any): any {
  const source = payload ?? fallback ?? {};
  const specificMonthId = toMessageId(
    source.specificMonthId ?? source.mesEspecificoId ?? fallback?.specificMonthId ?? 1,
  );
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const specificMonth =
    source.specificMonth ??
    (specificMonthId ? monthNames[specificMonthId - 1] : 'January');
  const description = source.description ?? fallback?.description ?? '';
  const startDate = source.startDate ?? fallback?.startDate ?? '2025-01-01';
  const endDate = source.endDate ?? fallback?.endDate ?? '2025-12-31';
  const isDynamic =
    source.messageType === 'Dynamic' ||
    source.messageTypeId === 2 ||
    (typeof source.messageType === 'string' &&
      source.messageType.toLowerCase() === 'dynamic');

  return {
    active: source.active ?? fallback?.active ?? true,
    endDate,
    startDate,
    description,
    id,
    specificMonth,
    specificMonthId: specificMonthId ?? 1,
    messageType: isDynamic ? 'Dynamic' : 'Fixed',
    messageTypeId: isDynamic ? 2 : 1,
    descricao: description,
    dataInicio: startDate,
    dataFim: endDate,
    mesEspecificoId: specificMonthId ?? 1,
  };
}

function handleAdvanceRequestMessages(
  context: MockRequestContext,
  segments: string[],
): HttpResponse<unknown> {
  const action = normalize(segments[1]);

  if (context.method === 'get') {
    if (action === 'paged') {
      const typeParam = context.params['IdTypeMessage'] ?? context.params['idTypeMessage'];
      let filtered = MOCK_MESSAGES.slice();
      if (typeParam) {
        const typeId = Number(typeParam);
        filtered = filtered.filter((message) => message.messageTypeId === typeId);
      }
      const skip = Number(context.params['skip'] ?? 0);
      const take = Number(context.params['take'] ?? filtered.length);
      const page = filtered.slice(skip, skip + take);
      return ok({
        data: page.map((message) => ({ ...message })),
        totalElements: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / (take || 1))),
        dados: page.map((message) => ({ ...message })),
        totalElementos: filtered.length,
        totalPaginas: Math.max(1, Math.ceil(filtered.length / (take || 1))),
      });
    }

    if (action === 'dynamic' && segments[2] === 'month') {
      const monthId = toNumber(segments[3]);
      const filtered = monthId
        ? MOCK_MESSAGES.filter((message) => message.specificMonthId === monthId)
        : MOCK_MESSAGES.slice();
      return ok({
        data: filtered.map((message) => ({ ...message })),
        totalElements: filtered.length,
        totalPages: 1,
        dados: filtered.map((message) => ({ ...message })),
        totalElementos: filtered.length,
        totalPaginas: 1,
      });
    }

    if (!Number.isNaN(Number(action)) && action) {
      const target = MOCK_MESSAGES.find(
        (message) => message.id === toNumber(action),
      );
      return target ? ok({ ...target }) : failure(404, 'Message not found');
    }

    return ok(MOCK_MESSAGES.map((message) => ({ ...message })));
  }

  if (context.method === 'post') {
    const isDynamic = action === 'dynamic';
    const created = buildMessageRow(
      MOCK_MESSAGES.reduce((max, message) => Math.max(max, message.id), 0) + 1,
      context.body,
    );
    created.messageType = isDynamic ? 'Dynamic' : 'Fixed';
    created.messageTypeId = isDynamic ? 2 : 1;
    MOCK_MESSAGES.push(created);
    persist('messages_v1', MOCK_MESSAGES);
    return ok({ ...created });
  }

  if (context.method === 'put') {
    const target = MOCK_MESSAGES.find(
      (message) => message.id === toNumber(segments[1]),
    );
    if (!target) return failure(404, 'Message not found');
    const updated = buildMessageRow(target.id, context.body, target);
    const index = MOCK_MESSAGES.indexOf(target);
    MOCK_MESSAGES[index] = updated;
    persist('messages_v1', MOCK_MESSAGES);
    return ok({ ...updated });
  }

  if (context.method === 'patch') {
    const target = MOCK_MESSAGES.find(
      (message) => message.id === toNumber(segments[1]),
    );
    if (!target) return failure(404, 'Message not found');
    const subAction = normalize(segments[2]);
    if (subAction === 'activate' || subAction === 'enable') target.active = true;
    if (subAction === 'deactivate' || subAction === 'disable') target.active = false;
    persist('messages_v1', MOCK_MESSAGES);
    return ok({ ...target });
  }

  if (context.method === 'delete') {
    const index = MOCK_MESSAGES.findIndex(
      (message) => message.id === toNumber(segments[1]),
    );
    if (index === -1) return failure(404, 'Message not found');
    MOCK_MESSAGES.splice(index, 1);
    persist('messages_v1', MOCK_MESSAGES);
    return ok({});
  }

  return ok({});
}

function handleFallback(
  context: MockRequestContext,
  segments: string[],
): HttpResponse<unknown> {
  const resource = normalize(segments[0]);


  // The page-access bookkeeping endpoint is a no-op in the offline build.
  if (resource.startsWith('page-access') || resource.startsWith('pageaccess')) {
    return ok({
      message: 'Mock page-access bookkeeping accepted the request.',
    });
  }

  console.warn(
    `[mock-api] no dedicated handler for ${context.method.toUpperCase()} /api/${segments.join('/')}`,
  );

  return ok(context.method === 'get' ? [] : {});
}
