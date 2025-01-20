import { TuiRoot, TuiLoader, tuiLoaderOptionsProvider } from "@taiga-ui/core";
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from "./services/auth/auth.service";
import { CommonModule } from "@angular/common";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { FirestoreModule } from "@angular/fire/firestore";
import { TranslateService } from "@ngx-translate/core";
import languages from "./data/languages";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TuiRoot, TuiRoot, TuiLoader, AngularFirestoreModule, FirestoreModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [tuiLoaderOptionsProvider({ size: 'xl' })]
})
export class AppComponent implements OnInit {
  private translateService = inject(TranslateService);

  public loading: boolean = true;

  constructor(
    public authService: AuthService
  ) { }

  async ngOnInit() {
    this.authService.getUser();
    this.setLanguage();
  }

  async setLanguage() {
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.setDefaultLang(browserLang ? browserLang : 'en');
    this.translateService.use(browserLang);

    const supportedLangs = languages.map(language => language.id);
    supportedLangs.forEach((language) => {
      this.translateService.reloadLang(language);
    });
  }
}
