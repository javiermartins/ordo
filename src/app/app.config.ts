import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withViewTransitions } from '@angular/router';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NG_EVENT_PLUGINS } from "@taiga-ui/event-plugins";
import { environment } from "../environments/environment";
import { routes } from './app.routes';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), provideRouter(routes, withViewTransitions()), provideClientHydration(), NG_EVENT_PLUGINS,
  importProvidersFrom(
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  )]
};
