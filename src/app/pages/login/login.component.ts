import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton } from '@taiga-ui/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TuiButton],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async loginWithGoogle() {
    this.authService.loginWithGoogle().then(async () => {
      await this.checkAndCreateUser();
    }).catch(error => {
      console.error(error);
    });
  }

  async checkAndCreateUser() {
    await this.authService.checkAndCreateUser().then(() => {
      this.router.navigate(['/dashboard']);
    });
  }

}
