import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TuiAppearance, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    TuiAppearance,
    TuiAvatar,
    TuiIcon,
    TuiNavigation,
    TuiDataList,
    TuiDropdown,
    TranslateModule
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

  closeMenu() {
    this.openMenu = false;
  }

}
