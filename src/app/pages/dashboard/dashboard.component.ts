import { Component } from '@angular/core';
import { TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardMedium, TuiHeader } from '@taiga-ui/layout';
import { ProjectsService } from '../../services/projects/projects.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, TuiCardMedium, TuiHeader, TuiSurface, TuiTitle],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

    public projects: any[] = [];

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
