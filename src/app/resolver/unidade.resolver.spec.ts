import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { unidadeResolver } from './unidade.resolver';

describe('unidadeResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => unidadeResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
