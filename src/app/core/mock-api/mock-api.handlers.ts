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

const nowIso = (): string => new Date().toISOString();

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
  context: MockRequestContext
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
    default:
      return handleFallback(context, segments);
  }
}

function handleUsers(
  context: MockRequestContext,
  segments: string[]
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
          .map(serializeUser)
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
      context.body
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

    const enable = action === 'activate' || action === 'enable';

    target.isActive =
      context.method === 'delete' ? false : action === 'deactivate' ? false : enable;
    target.updatedAt = nowIso();
    registerEvent(
      'User',
      target.id,
      target.isActive ? 'Record enabled' : 'Record disabled'
    );

    return ok(serializeUser(target));
  }

  return failure(405, `${context.method.toUpperCase()} is not supported for users`);
}

function searchDirectory(term: string | undefined): MockRow[] {
  const needle = normalize(term);

  if (!needle) return [];

  return MOCK_USERS.filter((user) =>
    [user.name, user.email, user.employeeId].join(' ').toLowerCase().includes(needle)
  )
    .slice(0, 10)
    .map(serializeUser);
}

function excelResponse(): HttpResponse<unknown> {
  const header = 'Employee ID,Name,Job title,E-mail,Unit,Status';
  const rows = MOCK_USERS.map(
    (user) =>
      `${user.employeeId},${user.name},${user.jobTitle},${user.email},${user.unitName},${user.isActive ? 'Active' : 'Inactive'}`
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
          pick(item, ['description', 'name', 'text']) ?? known?.name ?? ''
        ),
      };
    })
    .filter((profile): profile is MockProfileSummary => profile !== undefined);
}

function createUser(body: unknown): MockUser {
  const unitId =
    toNumber(pick(body, ['unitId'])) ?? MOCK_UNITS[0].id;
  const unit = MOCK_UNITS.find((item) => item.id === unitId);
  const active = pick(body, ['isActive']);

  const user: MockUser = {
    id: nextMockId(MOCK_USERS),
    name: String(pick(body, ['name']) ?? 'New team member'),
    email: String(pick(body, ['email']) ?? ''),
    employeeId: String(
      pick(body, ['employeeId']) ?? nextMockId(MOCK_USERS) + 399999
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

  return user;
}

function updateUser(
  id: number | undefined,
  body: unknown
): MockUser | undefined {
  const target = MOCK_USERS.find((user) => user.id === id);

  if (!target) return undefined;

  const unitId = toNumber(pick(body, ['unitId']));
  const unit = unitId ? MOCK_UNITS.find((item) => item.id === unitId) : undefined;
  const active = pick(body, ['isActive']);

  target.name = String(pick(body, ['name']) ?? target.name);
  target.email = String(pick(body, ['email']) ?? target.email);
  target.employeeId = String(
    pick(body, ['employeeId']) ?? target.employeeId
  );
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

  return target;
}

function registerEvent(
  entityName: string,
  entityId: number,
  action: string
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

  return event;
}

function handleProfiles(
  context: MockRequestContext,
  segments: string[]
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
        }))
      );
    }

    const found = MOCK_PROFILES.find(
      (profile) => profile.id === toNumber(segments[1])
    );

    return found
      ? ok(serializeProfile(found))
      : failure(404, `Profile ${segments[1]} was not found`);
  }

  if (context.method === 'post' || context.method === 'put') {
    const id =
      context.method === 'put'
        ? toNumber(segments[1]) ?? toNumber(pick(context.body, ['id']))
        : undefined;
    const existing = MOCK_PROFILES.find((profile) => profile.id === id);
    const features = mapPayloadFeatures(context.body);
    const name = String(
      pick(context.body, ['profileName', 'name', 'description']) ?? 'New profile'
    );
    const description = String(
      pick(context.body, ['profileText', 'text', 'description']) ?? ''
    );
    const accessDeniedEmail = String(
      pick(context.body, ['accessDeniedEmail']) ??
        'support@procurementflow.demo'
    );

    if (existing) {
      existing.name = name;
      existing.description = description;
      existing.accessDeniedEmail = accessDeniedEmail;
      existing.features = features;
      existing.updatedAt = nowIso();
      registerEvent('Profile', existing.id, 'Record updated');

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

    return context.method === 'post'
      ? created(serializeProfile(profile))
      : ok(serializeProfile(profile));
  }

  return failure(405, `${context.method.toUpperCase()} is not supported for profiles`);
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
            String(pick(requestedAction, ['code']) ?? '')
          );
          const catalogFeature = MOCK_FEATURE_CATALOG.find(
            (feature) => feature.id === featureId
          );
          const catalogAction = catalogFeature?.actions.find(
            (action) => normalize(action.code) === requestedCode
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
          featureGranted && (grantEveryAction || granted?.has(action.id) === true),
      })),
    };
  });
}

function handleFeatureCatalog(
  context: MockRequestContext,
  segments: string[]
): HttpResponse<unknown> {
  if (context.method !== 'get') {
    return failure(
      405,
      `${context.method.toUpperCase()} is not supported for the feature catalogue`
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
  segments: string[]
): HttpResponse<unknown> {
  if (context.method !== 'get') {
    return failure(405, `${context.method.toUpperCase()} is not supported for units`);
  }

  const direction = context.params['sortDirection'] ?? context.params['direction'];
  const descending =
    direction !== undefined &&
    (direction === '-1' || normalize(direction).startsWith('desc'));

  const units = [...MOCK_UNITS].sort((left, right) =>
    descending
      ? right.name.localeCompare(left.name)
      : left.name.localeCompare(right.name)
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
  segments: string[]
): HttpResponse<unknown> {
  if (context.method !== 'get') {
    return failure(405, `${context.method.toUpperCase()} is not supported for events`);
  }

  const entityId = toNumber(segments[2]);

  if (entityId === undefined) {
    return ok(MOCK_EVENTS.map(serializeEvent));
  }

  return ok(
    MOCK_EVENTS.filter(
      (event) => event.entityId === entityId
    ).map(serializeEvent)
  );
}

function handleFallback(
  context: MockRequestContext,
  segments: string[]
): HttpResponse<unknown> {
  const resource = normalize(segments[0]);

  // The page-access bookkeeping endpoint is a no-op in the offline build.
  if (resource.startsWith('page-access') || resource.startsWith('pageaccess')) {
    return ok({ message: 'Mock page-access bookkeeping accepted the request.' });
  }

  console.warn(
    `[mock-api] no dedicated handler for ${context.method.toUpperCase()} /api/${segments.join('/')}`
  );

  return ok(context.method === 'get' ? [] : {});
}



