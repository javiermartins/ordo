import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { environment } from '../../../environments/environment';
import { ID } from 'appwrite';
import { account } from '../../../lib/appwrite';
import { ApiService } from '../../services/api/api.service';
import { Router } from '@angular/router';
import { ProjectsService } from '../../services/projects/projects.service';

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
    private apiService: ApiService,
    private projectsService: ProjectsService,
    private router: Router
  ) { }

  async createNewProject() {
    this.saving = true;
    const projectName = this.projectForm.controls['name'].value;
    const user: any = await account.get();
    const data = {
      name: projectName,
      created_date: new Date(),
      owner_id: user.$id
    };

    await this.apiService.createDocument(environment.PROJECTS_COLLECTION, ID.unique(), data).then(async () => {
      await this.projectsService.loadProjects();
      this.router.navigate(['/dashboard']);
    }).catch(() => {
      this.saving = false;
    });
  }

}
