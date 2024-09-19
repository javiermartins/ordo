import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { TuiNavigation } from '@taiga-ui/layout';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, TuiNavigation],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
    await this.authService.checkAndCreateUser();
  }


}
