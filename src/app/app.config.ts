import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { importProvidersFrom } from '@angular/core';
import { environment as env } from '../environments/environment';
import { AppRoutingModule } from './app.routes';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './lib/auth/auth.interceptor';
import { ApiModule, BASE_PATH } from './lib/api-client';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { Noir } from './themePreset';

export const appConfig: ApplicationConfig = {
    providers: [
    provideRouter(routes, withComponentInputBinding()),
        provideAnimationsAsync(),
        providePrimeNG({
            ripple: true,
            theme: {
              preset: Noir,
                options: {
                  prefix: 'p',
                  darkModeSelector: false || 'none',
                  cssLayer: {
                    name: 'primeng',
                    order: 'theme, base, primeng'
                  }
                }
            }
        }),
        importProvidersFrom(
            AppRoutingModule,
            AuthModule.forRoot({
                config: {
                    authority: `${env.oidc.domain}`,
                    redirectUrl: `${env.baseURL}/oidc/callback`,
                    postLoginRoute: '/app/home',
                    secureRoutes: [env.backend],
                    postLogoutRedirectUri: '/loggedout',
                    clientId: `${env.oidc.clientId}`,
                    scope: 'openid profile email offline_access',
                    responseType: 'code',
                    silentRenew: true,
                    silentRenewUrl: `${env.baseURL}/oidc/silent-renew`,
                    useRefreshToken: true,
                    renewTimeBeforeTokenExpiresInSeconds: 60,
                    ignoreNonceAfterRefresh: true,
                    logLevel: LogLevel.Warn,
                },
            }),
            ApiModule
        ),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: BASE_PATH, useValue: `${env.backend}/api/v2` },
        provideHttpClient(), // Provides HttpClient globally
    ]
};
