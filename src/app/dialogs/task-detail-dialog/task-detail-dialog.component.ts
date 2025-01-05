import { ChangeDetectionStrategy, Component, inject, INJECTOR, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDataList, TuiDialogContext, TuiDialogOptions, TuiDialogService, TuiDropdown, TuiIcon, TuiLabel } from '@taiga-ui/core';
import { TuiCheckbox, TuiDataListDropdownManager } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextareaModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext, PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Task } from '../../models/project.model';
import { ProjectsService } from '../../services/projects/projects.service';
import { DatePipe } from '@angular/common';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';

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

  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);

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

  confirmDeleteTask() {
    const dialogOptions: Partial<TuiDialogOptions<any>> = {
      closeable: false,
      dismissible: true,
      data: {
        header: 'Are you sure you want to delete this task?',
        description: 'This action cannot be undone.'
      }
    }

    this.dialogs
      .open(new PolymorpheusComponent(ConfirmDeleteComponent, this.injector), dialogOptions)
      .subscribe({
        next: async (value: any) => {
          if (value) {
            this.deleteTask();
          }
        },
      });
  }

  deleteTask() {
    this.projectsService.deleteTask(this.projectId, this.sectionId, this.task.id).then(() => {
      this.context.completeWith();
    });
  }

}
