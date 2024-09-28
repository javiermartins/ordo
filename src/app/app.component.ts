import { TuiRoot, TuiLoader, tuiLoaderOptionsProvider } from "@taiga-ui/core";
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from "./services/auth/auth.service";
import { CommonModule } from "@angular/common";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { FirestoreModule } from "@angular/fire/firestore";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent, TuiRoot, TuiRoot, TuiLoader, AngularFirestoreModule, FirestoreModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [tuiLoaderOptionsProvider({ size: 'xl' })]
})
export class AppComponent implements OnInit {

  public loading: boolean = true;

  constructor(
    public authService: AuthService
  ) { }

  async ngOnInit() {
    this.authService.getUser();
  }
}
