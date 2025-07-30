import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideLoadingBar } from '@ngx-loading-bar/core';
import { provideLoadingBarRouter } from '@ngx-loading-bar/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideLoadingBar({ latencyThreshold: 50,}), // 👈 Pass config
    provideLoadingBarRouter()
  ]
};
