import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { TuiChevron, TuiFade } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import { ProjectsService } from '../../services/projects/projects.service';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TuiChevron,
    TuiDataList,
    TuiDropdown,
    TuiFade,
    TuiNavigation,
    TranslateModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  protected expanded = true;
  public projects: Project[] = [];

  constructor(
    private projectsService: ProjectsService
  ) { }

  async ngOnInit() {
    await this.projectsService.loadProjects();
    await this.loadProjects();
  }

  async loadProjects() {
    this.projectsService.projects$.subscribe((projects) => {
      this.projects = projects;
    });
  }

}
