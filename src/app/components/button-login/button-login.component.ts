import {Component, EventEmitter, Output} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {IconLoginComponent} from "../icons/icon-login/icon-login.component";

@Component({
  selector: 'app-button-login',
  standalone: true,
  imports: [
    NgOptimizedImage,
    IconLoginComponent
  ],
  templateUrl: './button-login.component.html',
  styleUrl: './button-login.component.scss'
})
export class ButtonLoginComponent {
  @Output() click = new EventEmitter<void>();

  onClick(event: MouseEvent) {
    this.click.emit();
    event.stopPropagation();
  }
}
