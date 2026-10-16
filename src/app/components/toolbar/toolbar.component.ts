import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';
import { PageAccessService } from '../../services/page-access.service';
import { AuthService } from '../../services/auth.service';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavigationEnd, Router } from '@angular/router';
import { IconProfilePhotoComponent } from '../icons/icon-profile-photo/icon-profile-photo.component';
import { IconMenu3Component } from '../icons/icon-menu-3/icon-menu-3.component';
import { IconLogoutComponent } from '../icons/icon-logout/icon-logout.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';

const UNKNOWN_USER_NAME = 'Unknown user';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    OverlayPanelModule,
    ToolbarModule,
    ToastModule,
    IconProfilePhotoComponent,
    IconMenu3Component,
    IconLogoutComponent,
    ButtonModule,
    TooltipModule
],
  providers: [MessageService],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  /** Display name of the authenticated (mock) session. */
  userName: string = UNKNOWN_USER_NAME;

  /** E-mail of the authenticated (mock) session. */
  email: string = '';
  isExpanded: boolean = false;

  private subscriptions: Subscription[] = [];
  private pageName = '';
  private userId: string = '';
  private displayedMessages: Set<string> = new Set();

  constructor(
    private sidebarService: SidebarService,
    private pageAccessService: PageAccessService,
    private authService: AuthService,
    private authSessionService: AuthSessionService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.sidebarService.isExpanded$.subscribe(
        (isExpanded: boolean) => (this.isExpanded = isExpanded)
      ),
      this.authSessionService.session$.subscribe(() => this.syncSessionUser())
    );

    this.syncSessionUser();

    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.pageName = event.url.replace('/', '');
          this.initAccessPage();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.userId = this.currentUserId();
    this.pageAccessService.leavePage(this.pageName, this.userId).subscribe({
      next: () => console.log('Page access released'),
      error: (err) => console.error('Error while releasing access:', err),
    });

    this.pageAccessService.stopConnection();

    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /** Clears the mock session and sends the user back to the login page. */
  logout(): void {
    this.userName = UNKNOWN_USER_NAME;
    this.email = '';
    this.authService.logout();
  }

  logoutFromMenu(menu?: { hide: () => void }): void {
    menu?.hide();
    this.logout();
  }

  initAccessPage() {
    if (this.pageName == '') {
      return;
    }

    this.userId = this.currentUserId();
    this.pageAccessService.enterPage(this.pageName, this.userId);

    const pageInUseSub = this.pageAccessService
      .onPageInUse()
      .subscribe((currentUser) => {
        // this.showMessage('error', 'Error', `The page is already in use by user ${currentUser}`)
        // this.router.navigate(['/'])
      });

    const accessGrantedSub = this.pageAccessService
      .onAccessGranted()
      .subscribe(() => {
        // this.showMessage('success', 'Success', 'Page access granted')
      });

    this.subscriptions.push(pageInUseSub, accessGrantedSub);
  }

  showMessage(severity: string, summary: string, detail: string, key?: string) {
    const messageKey = key || severity + '-' + summary + '-' + detail;

    if (!this.displayedMessages.has(messageKey)) {
      this.messageService.add({
        key: key,
        severity: severity,
        summary: summary,
        detail: detail,
        life: 3000,
      });

      this.displayedMessages.add(messageKey);

      setTimeout(() => {
        this.displayedMessages.delete(messageKey);
      }, 3000);
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  /** Reads name and e-mail straight from the mock session service. */
  private syncSessionUser(): void {
    const user = this.authSessionService.currentUser;

    this.userName = user?.name ?? UNKNOWN_USER_NAME;
    this.email = user?.email ?? '';
  }

  private currentUserId(): string {
    return String(this.authSessionService.currentUser?.id ?? '');
  }
}
