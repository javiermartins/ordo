import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { Router } from '@angular/router';
import { ProjectsService } from '../../services/projects/projects.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [ReactiveFormsModule, TuiInputModule, TuiButton],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {

  public saving: boolean = false;

  public projectForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private projectsService: ProjectsService,
    private router: Router
  ) { }

  async createNewProject() {
    this.saving = true;
    const projectName = this.projectForm.controls['name'].value;
    const user = this.authService.user;
    const data = {
      name: projectName,
      createdDate: new Date(),
      ownerId: user?.uid
    };

    await this.projectsService.createNewProject(data).then(async () => {
      await this.projectsService.loadProjects();
      this.router.navigate(['/dashboard']);
    }).catch(() => {
      this.saving = false;
    });
  }

}
