import { Component, inject, INJECTOR, OnInit } from '@angular/core';
import { BoardViewComponent } from '../../components/project/board-view/board-view.component';
import { TuiDataListDropdownManager, TuiTabs } from '@taiga-ui/kit';
import { ResumeViewComponent } from '../../components/project/resume-view/resume-view.component';
import { TuiButton, TuiDataList, TuiDialogOptions, TuiDialogService, TuiDropdown, TuiLoader } from '@taiga-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../services/projects/projects.service';
import { TuiInputModule } from '@taiga-ui/legacy';
import { FormsModule } from '@angular/forms';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { ConfirmDeleteComponent } from '../../dialogs/confirm-delete/confirm-delete.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [TuiTabs, BoardViewComponent, ResumeViewComponent,
    TuiDropdown, TuiDataList, TuiDataListDropdownManager, TuiButton,
    TuiLoader, TuiInputModule, FormsModule, TranslateModule
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);

  protected activetab = 1;

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

  confirmDelete() {
    const dialogOptions: Partial<TuiDialogOptions<any>> = {
      closeable: false,
      dismissible: true,
      data: {
        header: `Delete the project "${this.project.name}"?`,
        description: 'All related data will be permanently deleted.\n Are you sure you want to delete this project?'
      }
    }

    this.dialogs
      .open(new PolymorpheusComponent(ConfirmDeleteComponent, this.injector), dialogOptions)
      .subscribe({
        next: async (value: any) => {
          if (value) {
            this.deleteProject();
          }
        },
      });
  }

  async deleteProject() {
    await this.projectsService.deleteProject(this.projectId).then(async () => {
      await this.projectsService.loadProjects();
      this.router.navigate(['/dashboard']);
    }).catch((error: Error) => {
      console.error(error);
    });
  }

  updateProjectTitle() {
    this.projectsService.updateProject(this.project);
  }

}