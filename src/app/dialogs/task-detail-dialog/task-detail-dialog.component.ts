import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDataList, TuiDialogContext, TuiDropdown, TuiIcon, TuiLabel } from '@taiga-ui/core';
import { TuiCheckbox, TuiDataListDropdownManager } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextareaModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { Task } from '../../models/project.model';
import { ProjectsService } from '../../services/projects/projects.service';
import { DatePipe } from '@angular/common';

export class FormData {
  title: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-detail-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, TuiInputModule, TuiTextfieldControllerModule, TuiButton,
    TuiDropdown, TuiTextareaModule, TuiDataList, TuiDataListDropdownManager, TuiCheckbox, TuiLabel, TuiIcon,
    DatePipe
  ],
  templateUrl: './task-detail-dialog.component.html',
  styleUrl: './task-detail-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailDialogComponent {
  protected readonly context =
    injectContext<TuiDialogContext<void, any>>();

  public task: Task = this.context?.data?.task;
  public taskForm: FormGroup = new FormGroup('');
  private projectId: string = this.context?.data?.projectId;
  private sectionId = this.context?.data?.sectionId;

  constructor(
    private projectsService: ProjectsService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.onFormChange();
  }

  initForm() {
    this.taskForm = new FormGroup({
      completed: new FormControl(this.task.completed || false),
      title: new FormControl(this.task.title || ''),
      description: new FormControl(this.task.description || '')
    });
  }

  onFormChange() {
    this.taskForm.valueChanges.subscribe((formData) => {
      this.updateTask(formData);
    });
  }

  updateTask(formData: FormData) {
    this.task.title = formData.title;
    this.task.description = formData.description;
    this.task.completed = formData.completed;

    this.projectsService.updateTask(this.projectId, this.sectionId, this.task);
  }

  deleteTask() {
    this.projectsService.deleteTask(this.projectId, this.sectionId, this.task.id).then(() => {
      this.context.completeWith();
    });
  }

}
