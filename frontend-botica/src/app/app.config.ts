import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// IMPORTAMOS HttpClient y la función para interceptores
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
// IMPORTAMOS NUESTRO INTERCEPTOR
import { authInterceptor } from './interceptors/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // AÑADIMOS EL INTERCEPTOR A LAS PETICIONES HTTP
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};
