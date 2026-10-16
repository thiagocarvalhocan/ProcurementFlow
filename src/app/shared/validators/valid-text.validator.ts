import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validTextValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value as string;

  if (value === null || value === undefined || value === '') {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return { onlySpaces: true };
  }

  const isThereNumberOrLetter = /[a-zA-ZÀ-ÿ0-9]/.test(trimmed);

  if (!isThereNumberOrLetter) {
    return { invalidContent: true };
  }

  return null;
}
