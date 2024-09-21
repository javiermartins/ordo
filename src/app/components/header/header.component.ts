import { Component } from '@angular/core';
import { TuiAppearance, TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiHeader, TuiNavigation } from '@taiga-ui/layout';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TuiAppearance,
    TuiAvatar,
    TuiButton,
    TuiHeader,
    TuiIcon,
    TuiNavigation,
    TuiDataList,
    TuiDropdown
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected openMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async logout() {
    await this.authService.logout().then(() => this.router.navigate(['/login']));
  }

}
