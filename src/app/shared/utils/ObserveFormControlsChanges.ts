import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export function observeFormControlsChanges(
  formGroup: FormGroup,
  controlNames: string[],
  callback: (name: string, value: any) => void,
  destroyRef: DestroyRef,
  debounce = 500
): void {
  controlNames.forEach((name) => {
    const control = formGroup.get(name);
    if (control) {
      control.valueChanges
        .pipe(
          debounceTime(debounce),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe((value) => callback(name, value));
    }
  });
}