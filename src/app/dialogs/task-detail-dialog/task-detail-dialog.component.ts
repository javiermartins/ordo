import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDataList, TuiDialogContext, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiTextareaModule } from '@taiga-ui/legacy';
import { Task } from '../../models/project.model';
import { TuiDataListDropdownManager } from '@taiga-ui/kit';
import { TuiLet } from '@taiga-ui/cdk';
import { ProjectsService } from '../../services/projects/projects.service';

@Component({
  selector: 'app-task-detail-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, TuiInputModule, TuiTextfieldControllerModule, TuiButton, TuiIcon,
    TuiDropdown, TuiTextareaModule, TuiDataList, TuiLet, TuiDataListDropdownManager],
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

  constructor(
    private projectsService: ProjectsService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.taskForm = new FormGroup({
      title: new FormControl(this.task.title),
      description: new FormControl(this.task.description)
    });
  }

  deleteTask() {
    const projectId = this.context?.data?.projectId;
    const sectionId = this.context?.data?.sectionId;

    this.projectsService.deleteTask(projectId, sectionId, this.task.id).then(() => {
      this.context.completeWith();
    });
  }

}
