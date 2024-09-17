import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { TuiNavigation } from '@taiga-ui/layout';
import { ApiService } from '../../services/api/api.service';
import { environment } from '../../../environments/environment';
import { Query } from 'appwrite';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, TuiNavigation],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  private user: any;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    await this.getUser();
    await this.getProjects();
  }

  async getUser() {
    this.user = await this.authService.getUser();
  }

  async getProjects() {
    const projects = await this.apiService.getDocuments(environment.PROJECTS_COLLECTION, [Query.equal('$id', this.user.$id)]);
    console.log(projects);
  }

}
