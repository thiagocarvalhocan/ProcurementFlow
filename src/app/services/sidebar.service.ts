import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface NavItem {
  route?: string;
  icon: any;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isExpanded = new BehaviorSubject<boolean>(false);
  
  isExpanded$ = this._isExpanded.asObservable();
  items: NavItem[] = [];

  private _collapseHover = new Subject<void>();
  collapseHover$ = this._collapseHover.asObservable();

  toggleSidebar() {
    this._isExpanded.next(!this._isExpanded.value);
  }

  closeSidebar() {
    this._isExpanded.next(false);
  }

  requestCollapseHover() {
    this._collapseHover.next();
  }
}
