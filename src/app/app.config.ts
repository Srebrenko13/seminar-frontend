import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {routes} from './app.routes'; // You can also use Lara or Nora

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark' // Optional: for dark mode toggling
        }
      }
    })
  ]
};
