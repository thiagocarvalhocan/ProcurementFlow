import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  toggleSidebar() {
    this._isExpanded.next(!this._isExpanded.value);
  }

  closeSidebar() {
    this._isExpanded.next(false);
  }
}
