import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-icon-add-square',
    standalone: true,
    templateUrl: './icon-add-square.component.html'
})
export class IconAddSquareComponent {
    @Input() color: string = '#292D32';
    @Input() size: string = '24px';
}
