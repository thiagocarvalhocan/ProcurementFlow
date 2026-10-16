import { Component, Input, OnInit } from '@angular/core';
import {
  NgClass,
  NgForOf,
  NgIf,
  NgOptimizedImage,
} from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { DynamicIconDirective } from '../../directives/dynamic-icon.directive';
import { SidebarService } from '../../services/sidebar.service';
import { UserPermissionService } from '../../services/user-permission.service';
import { IconSettingsComponent } from '../icons/icon-settings/icon-settings.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { navItems } from './Sidebar';

interface NavItem {
  route?: string;
  icon: any;
  name: string;
  feature: string;
  subItems?: any[];
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    NgClass,
    NgForOf,
    NgIf,
    DynamicIconDirective,
    OverlayPanelModule,
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnInit {
  @Input() isMobileOpen = false;

  activeRoute?: string = '/';
  isSubmenuUnitsActive: boolean = false;
  navItems = [] as NavItem[];
  isExpanded: boolean = false;
  hoveredItemIndex: number | null = null;
  adminTitle = { name: 'Settings', icon: IconSettingsComponent };

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    public userPermissionService: UserPermissionService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.urlAfterRedirects;
      }
    });

    this.navItems = navItems;

    this.navItems = this.navItems
      .map((nav) => {
        if (nav.subItems) {
          nav.subItems = nav.subItems
            .filter(subItem => subItem.visibleInMenu !== false)
            .filter(subItem => subItem.feature && this.userPermissionService.hasFeature(subItem.feature))
            .filter(subItem => !subItem.unitId || (subItem.unitId && this.userPermissionService.getCurrentUser()?.unitId));
        }
        return nav;
      })
      .filter((nav) =>
          (!nav.feature ||
            (nav.feature && this.userPermissionService.hasFeature(nav.feature))) && (!nav.subItems || nav.subItems.length != 0)
      );

    this.sidebarService.items = this.navItems;
  }

  ngOnInit(): void {
    this.sidebarService.isExpanded$.subscribe(
      (isExpanded) => (this.isExpanded = isExpanded)
    );

    if (this.activeRoute === '/') {
      this.setRouteActive('/');
    }
  }

  setRouteActive(route?: string): void {
    this.activeRoute = route;
  }

  isRouteActive(item: any): boolean {
    if (!item.subItems) {
      return this.activeRoute === item.route;
    };

    const pattern = new RegExp(`^${item.route}(\\/|$)`);
    return pattern.test(this.activeRoute || '');
  }

  onClick(subItem: any, parent?: any) {
    const route = `${parent?.route || ''}${subItem?.route || ''}`;
    this.setRouteActive(route);

    if (this.isExpanded) {
        this.isExpanded = false;
        this.toggleSidebar();
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
