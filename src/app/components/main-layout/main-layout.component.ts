import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterOutlet } from "@angular/router";
import { SidebarService } from '../../services/sidebar.service';
import { ContentComponent } from "../content/content.component";
import { SideBarComponent } from "../side-bar/side-bar.component";
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NgIf, SideBarComponent, ContentComponent, ToolbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;
  isMobileNavOpen = false;
  dataName: any;

  constructor(private router: Router, private sidebarService: SidebarService) {
    this.sidebarService.isExpanded$.subscribe(
      (open) => (this.isMobileNavOpen = open)
    );
  }

  closeMobileNav(): void {
    this.sidebarService.closeSidebar();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

}
