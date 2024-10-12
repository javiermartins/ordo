import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiTextareaModule } from '@taiga-ui/legacy';
import { debounceTime, Subject } from 'rxjs';
import { ProjectsService } from '../../../services/projects/projects.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-resume-view',
  standalone: true,
  imports: [ReactiveFormsModule, TuiTextareaModule],
  templateUrl: './resume-view.component.html',
  styleUrl: './resume-view.component.scss'
})
export class ResumeViewComponent implements OnInit {
  @Input() project: Project;

  public projectForm: FormGroup = new FormGroup('');
  private descriptionChangeSubject = new Subject<string>();

  constructor(
    private projectsService: ProjectsService
  ) {
    this.initializeDescriptionChangeSubscription();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.projectForm = new FormGroup({
      description: new FormControl(this.project?.description)
    });
  }

  private initializeDescriptionChangeSubscription() {
    this.descriptionChangeSubject.pipe(debounceTime(500)).subscribe(async (description) => {
      await this.onUpdateDescription(description);
    });
  }

  onInputChange() {
    const description = this.projectForm.controls['description'].value;
    this.descriptionChangeSubject.next(description);
  }

  async onUpdateDescription(description: string) {
    this.project.description = description;
    try {
      await this.projectsService.updateProject(this.project);
    } catch (error) {
      console.error(error);
    }
  }

}
