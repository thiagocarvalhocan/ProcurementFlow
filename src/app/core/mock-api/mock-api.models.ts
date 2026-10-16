import { FeatureAction } from '../auth/models/feature-action';

export interface MockUnit {
  id: number;
  code: string;
  name: string;
  regionOfficeId: number;
  regionOfficeName: string;
  isActive: boolean;
}

export interface MockProfileSummary {
  id: number;
  name: string;
  description?: string;
}

export interface MockUser {
  id: number;
  name: string;
  email: string;
  employeeId: string;
  jobTitle: string;
  phone: string;
  isActive: boolean;
  unitId: number;
  unitName: string;
  profiles: MockProfileSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface MockProfileAction extends FeatureAction {
  isActive: boolean;
}

export interface MockProfileFeature {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  actions: MockProfileAction[];
}

export interface MockProfile {
  id: number;
  name: string;
  description: string;
  accessDeniedEmail: string;
  allowEditing: boolean;
  features: MockProfileFeature[];
  createdAt: string;
  updatedAt: string;
}

export interface MockEntityEvent {
  id: number;
  entityName: string;
  entityId: number;
  action: string;
  userName: string;
  date: string;
}

export interface MockRequestContext {
  method: string;
  path: string;
  params: Record<string, string>;
  body: unknown;
  currentUser?: { id: number; name: string; email: string } | null;
}

export interface MockPaginatedResult<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}
