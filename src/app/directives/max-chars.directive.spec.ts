import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MaxCharsDirective } from './max-chars.directive';

@Component({
  standalone: true,
  selector: 'app-max-chars-host',
  imports: [MaxCharsDirective],
  template: '<textarea [appMaxChars]="5"></textarea>',
})
class MaxCharsHostComponent {}

describe('MaxCharsDirective', () => {
  let fixture: ComponentFixture<MaxCharsHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaxCharsHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaxCharsHostComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(fixture.debugElement.query(By.directive(MaxCharsDirective))).toBeTruthy();
  });

  it('truncates the typed value to the configured limit', () => {
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    textarea.value = '123456789';
    textarea.dispatchEvent(new Event('input'));

    expect(textarea.value).toBe('12345');
  });
});
