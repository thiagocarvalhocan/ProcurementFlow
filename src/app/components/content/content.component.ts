import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DynamicIconDirective } from '../../directives/dynamic-icon.directive';
import { IconArrowbackComponent } from '../icons/icon-arrowback/icon-arrowback.component';
import { IconContrastComponent } from '../icons/icon-contrast/icon-contrast.component';
import { IconInitComponent } from '../icons/icon-init/icon-init.component';
import { IconAslComponent } from '../icons/icon-asl/icon-asl.component';
import { navItems } from '../side-bar/Sidebar';
import { IconArrowrightComponent } from '../icons/icon-arrowright/icon-arrowright.component';
import { AccessibilityControlsComponent } from '../accessibility-controls/accessibility-controls.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    CommonModule,
    IconInitComponent,
    IconContrastComponent,
    IconAslComponent,
    DynamicIconDirective,
    IconArrowbackComponent,
    RouterModule,
    IconArrowrightComponent,
    AccessibilityControlsComponent,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {
  subHeader: any[] = [];
  isBackVisible: boolean = false;

  get lastItem() {
    return this.subHeader?.at(-1) ?? null;
  }

  get isHome() {
    return this.lastItem?.name === 'Home';
  }

  get showBackButton() {
    return this.isBackVisible;
  }

  constructor(private location: Location, private router: Router) {
    this.findNavPath();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.findNavPath();
      }
    });
  }

  findNavPath() {
    const paths = this.router.url
      .split('?')[0]
      .split('/')
      .filter((p) => p !== '')
      .map((p) => {
        return isNaN(Number(p)) ? p : ':id';
      });

    const subHeader: any[] = [];

    function findItem(items: any[], index: number): any {
      if (index >= paths.length && paths.length != 0) return;
      const found = items.find(
        (item) =>
          item.route.replaceAll('/', '') ==
          (paths[index] == ':id'
            ? `${paths[index]}${paths[index + 1]}`
            : paths[index] || '')
      );
      if (found) {
        subHeader.push(found);
        if (found.subItems) findItem(found.subItems, index + 1);
      }
    }

    findItem(navItems, 0);
    this.subHeader = subHeader;
    this.isBackVisible = paths.includes(':id');
  }

  back(): void {
    const routes = this.subHeader?.slice(0, -1);
    const route = routes.map((item) => item.route).join('');
    if (route && routes.length > 1) {
      this.router.navigateByUrl(route);
      return;
    }
    this.location.back();
  }

  onFontChange(type: 'increase' | 'decrease' | 'reset') {}

  handleSignLanguage() {}

  handleContrast() {}
}
