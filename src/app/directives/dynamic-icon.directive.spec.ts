import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DynamicIconDirective } from './dynamic-icon.directive';
import { IconSettingsComponent } from '../components/icons/icon-settings/icon-settings.component';

@Component({
  standalone: true,
  selector: 'app-dynamic-icon-host',
  imports: [DynamicIconDirective],
  template: '<div><span [appDynamicIcon]="config"></span></div>',
})
class DynamicIconHostComponent {
  config = { component: IconSettingsComponent, inputs: { size: '24' } };
}

describe('DynamicIconDirective', () => {
  let fixture: ComponentFixture<DynamicIconHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicIconHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicIconHostComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(fixture.debugElement.query(By.directive(DynamicIconDirective))).toBeTruthy();
  });

  it('renders the requested icon component', () => {
    const host: HTMLElement = fixture.nativeElement.querySelector('div');

    expect(host.children.length).toBeGreaterThan(1);
  });
});
