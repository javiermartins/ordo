import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiInputModule, TuiTextareaModule } from '@taiga-ui/legacy';
import { Router } from '@angular/router';
import { ProjectsService } from '../../services/projects/projects.service';
import { AuthService } from '../../services/auth/auth.service';
import { MAX_PROJECTS } from '../../utils/constants';
import { Project } from '../../models/project.model';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { TuiTooltip } from '@taiga-ui/kit';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [ReactiveFormsModule, TuiInputModule, TuiTextareaModule, TuiButton, NgxSonnerToaster, TuiIcon, TuiTooltip],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent implements OnInit {
  protected readonly toast = toast;

  public MAX_PROJECTS = MAX_PROJECTS;
  public projects: any[] = [];
  public saving: boolean = false;

  public projectForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  constructor(
    private authService: AuthService,
    private projectsService: ProjectsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getProjects();
  }

  async getProjects() {
    this.projects = await this.projectsService.getProjects();
  }

  async submitProject() {
    if (this.projects?.length < MAX_PROJECTS) {
      this.saving = true;
      const projectName = this.projectForm.controls['name'].value;
      const projectDescription = this.projectForm.controls['description'].value;
      const user = this.authService.user;
      const data = {
        name: projectName,
        description: projectDescription,
        createdDate: new Date(),
        ownerId: user?.uid
      };

      this.createNewProject(data);
    } else {
      toast.warning('Maximum number of projects reached', {
        description: 'Please remove a project so that a new one can be added.'
      });
    }
  }

  async createNewProject(data: Project) {
    await this.projectsService.createNewProject(data).then(async () => {
      await this.projectsService.loadProjects();
      this.router.navigate(['/dashboard']);
    }).catch(() => {
      this.saving = false;
    });
  }

}
