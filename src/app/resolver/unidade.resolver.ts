import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Unit } from '../models/Unit';
import { UnitService } from '../services/unit.service';

export const unitResolver: ResolveFn<Unit> = (route, state) => {
  return inject(UnitService).getByID(route?.paramMap?.get('idUnit'));
};
