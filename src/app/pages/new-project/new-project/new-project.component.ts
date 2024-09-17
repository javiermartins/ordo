import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { environment } from '../../../../environments/environment';
import { ID } from 'appwrite';
import { account } from '../../../../lib/appwrite';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [ReactiveFormsModule, TuiInputModule, TuiButton],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {

  public projectForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  constructor(
    private apiService: ApiService
  ) { }

  async createNewProject() {
    const projectName = this.projectForm.controls['name'].value;
    const user: any = await account.get();
    const data = {
      name: projectName,
      created_date: new Date(),
      user_id: [user.$id]
    };

    await this.apiService.createDocument(environment.PROJECTS_COLLECTION, ID.unique(), data)
  }

}
