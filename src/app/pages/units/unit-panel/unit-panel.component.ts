import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { UnitComponent } from './unit/unit.component';
import { ProcessComponent } from './process/process.component';
import { MaterialServiceUnitComponent } from './material-service-unit/material-service-unit.component';
import { UserLinkComponent } from './user-link/user-link.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-unit-panel',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    CardModule,
    ButtonModule,
    TabViewModule,
    UserLinkComponent,
    MaterialServiceUnitComponent,
    ProcessComponent,
    UnitComponent,
  ],
  templateUrl: './unit-panel.component.html',
  styleUrl: './unit-panel.component.scss',
  providers: [MessageService],
})
export class UnitPanelComponent {
  activeIndex: number = 0;
  mode: 'view' | 'edit' | 'new' = 'new';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      const index = params['activeIndex'];
      if (index !== undefined) {
        this.activeIndex = index;
      }
    });

    const url = this.router.url;
    this.mode = url.includes('view')
      ? 'view'
      : url.includes('edit')
      ? 'edit'
      : 'new';
  }

  onTabChange(index: number): void {
    this.activeIndex = index;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { activeIndex: index },
      queryParamsHandling: 'merge',
    });
  }
}
