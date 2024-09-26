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
import { Query } from 'appwrite';

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

  public project: any;
  public sections: any[] = [];
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
    this.apiService.getDocument(environment.PROJECTS_COLLECTION, this.projectId).then(async (project) => {
      this.project = project;
      await this.getSections();
    });
  }

  async getSections() {
    this.apiService.getDocuments(environment.SECTIONS_COLLECTION, [Query.equal('projectId', this.projectId)]).then(async (sections) => {
      this.sections = sections.documents;
      await this.sections.forEach((section) => {
        section.tasks = this.getTasks(section);
      });
    });
  }

  async getTasks(section: any) {
    this.apiService.getDocuments(environment.TASKS_COLLECTION, [Query.equal('sectionId', section.$id)])
      .then(tasks => section.tasks = tasks.documents);
  }

  async deleteProject() {
    //TODO: confirm dialog
    await this.apiService.deleteDocument(environment.PROJECTS_COLLECTION, this.projectId);
    await this.projectsService.loadProjects();
    this.router.navigate(['/dashboard']);
  }

}