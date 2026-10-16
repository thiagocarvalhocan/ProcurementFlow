import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';
import { mockApiInterceptor } from './interceptors/mock-api.interceptor';
import { registerLocaleData } from '@angular/common';
import { MessageService } from 'primeng/api';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeEn, 'en');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom([BrowserAnimationsModule]),
    provideHttpClient(withInterceptors([authInterceptor, mockApiInterceptor])),
    MessageService,
    { provide: LOCALE_ID, useValue: "en" }
  ]
};
