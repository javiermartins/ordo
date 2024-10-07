import { Component } from '@angular/core';
import { TuiIcon, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardMedium, TuiHeader } from '@taiga-ui/layout';
import { ProjectsService } from '../../services/projects/projects.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../models/project.model';
import { MAX_PROJECTS } from '../../utils/constants';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, TuiCardMedium, TuiHeader, TuiSurface, TuiTitle, TuiIcon],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

    public MAX_PROJECTS = MAX_PROJECTS;
    public projects: Project[];

    constructor(
        private projectsService: ProjectsService
    ) { }

    async ngOnInit() {
        await this.loadProjects();
    }

    async loadProjects() {
        this.projectsService.projects$.subscribe((projects) => {
            this.projects = projects;
        });
    }

}
