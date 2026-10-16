import { Directive, Input, ViewContainerRef, Type } from '@angular/core';

export interface IconConfig {
  color?: string;
  size?: string;
  [key: string]: any;
}

@Directive({
  standalone: true,
  selector: '[appDynamicIcon]'
})
export class DynamicIconDirective {
  @Input() set appDynamicIcon(config: {
    component: Type<any>;
    inputs?: IconConfig;
  }) {
    this.vcr.clear();

    const componentRef = this.vcr.createComponent(config.component);

    if (config.inputs) {
      Object.keys(config.inputs).forEach((key) => {
        (componentRef.instance as any)[key] = config.inputs![key];
      });
    }
  }

  constructor(private vcr: ViewContainerRef) { }
}
