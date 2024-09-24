import { Component, OnInit } from '@angular/core';
import { TuiHeader } from '@taiga-ui/layout';
import { BoardViewComponent } from '../../components/project/board-view/board-view.component';
import { TuiDataListDropdownManager, TuiTabs } from '@taiga-ui/kit';
import { ResumeViewComponent } from '../../components/project/resume-view/resume-view.component';
import { TuiButton, TuiDataList, TuiDropdown, TuiIcon, TuiLoader } from '@taiga-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { environment } from '../../../environments/environment';
import { ProjectsService } from '../../services/projects/projects.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [TuiHeader, TuiTabs, BoardViewComponent, ResumeViewComponent,
    TuiDropdown, TuiDataList, TuiDataListDropdownManager, TuiIcon, TuiButton,
    TuiLoader
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  protected activetab = 2;

  public exampleproject = {
    "id": "683472895798hdo938",
    "title": "Project 1",
    "description": "Description of project 1",
    "sections": [
      {
        "id": 1,
        "title": 'To do',
        "tasks": [
          { id: 1, title: 'Get to work' },
          { id: 2, title: 'Pick up groceries' },
          { id: 2, title: 'Go home' }
        ]
      },
      {
        "id": 2,
        "title": 'Done',
        "tasks": [
          { id: 1, title: 'Get up' },
          { id: 2, title: 'Brush teeth' },
          { id: 2, title: 'Take a shower' }
        ]
      }
    ]
  }

  public project: any;
  private projectId: string = '';

  constructor(
    private apiService: ApiService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getProjectId();
  }

  getProjectId() {
    this.project = null;
    this.route.paramMap.subscribe(async (params) => {
      this.projectId = params.get('projectId')!;
      await this.getProject();
    });
  }

  async getProject() {
    this.apiService.getDocument(environment.PROJECTS_COLLECTION, this.projectId).then((project) => {
      this.project = project;
    });
  }

  async deleteProject() {
    //TODO: confirm dialog
    await this.apiService.deleteDocument(environment.PROJECTS_COLLECTION, this.projectId);
    await this.projectsService.loadProjects();
    this.router.navigate(['/dashboard']);
  }

}