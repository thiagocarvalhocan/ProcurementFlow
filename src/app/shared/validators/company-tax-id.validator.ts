import { AbstractControl, ValidationErrors } from '@angular/forms';

export function companyTaxIdValidator(control: AbstractControl): ValidationErrors | null {
  let companyTaxId = (control.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (!companyTaxId) return { required: true };

  if (companyTaxId.length !== 14) return { companyTaxIdInvalid: true };

  const charValue = (char: string) => char.charCodeAt(0) - 48;

  const calcDV = (base: string) => {
    let weight = 2;
    let sum = 0;

    for (let i = base.length - 1; i >= 0; i--) {
      sum += charValue(base[i]) * weight;
      weight++;
      if (weight > 9) weight = 2;
    }

    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const dv1 = calcDV(companyTaxId.substring(0, 12));
  const dv2 = calcDV(companyTaxId.substring(0, 12) + dv1);

  if (Number(companyTaxId[12]) !== dv1 || Number(companyTaxId[13]) !== dv2) {
    return { companyTaxIdInvalid: true };
  }

  return null;
}