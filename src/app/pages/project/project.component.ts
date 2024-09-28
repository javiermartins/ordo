import { Component, OnInit } from '@angular/core';
import { TuiHeader } from '@taiga-ui/layout';
import { BoardViewComponent } from '../../components/project/board-view/board-view.component';
import { TuiDataListDropdownManager, TuiTabs } from '@taiga-ui/kit';
import { ResumeViewComponent } from '../../components/project/resume-view/resume-view.component';
import { TuiButton, TuiDataList, TuiDropdown, TuiIcon, TuiLoader } from '@taiga-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  public project: any;
  private projectId: string = '';

  constructor(
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
    this.projectsService.getProject(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  async deleteProject() {
    //TODO: confirm dialog
    await this.projectsService.deleteProject(this.projectId).then(async () => {
      await this.projectsService.loadProjects();
      this.router.navigate(['/dashboard']);
    }).catch((error: Error) => {
      console.error(error);
    });
  }

}