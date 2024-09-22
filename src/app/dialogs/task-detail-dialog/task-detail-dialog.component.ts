import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiTextareaModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-task-detail-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, TuiInputModule, TuiTextfieldControllerModule, TuiTextareaModule],
  templateUrl: './task-detail-dialog.component.html',
  styleUrl: './task-detail-dialog.component.scss'
})
export class TaskDetailDialogComponent {
  protected readonly context =
    injectContext<TuiDialogContext<void, any>>();

  public task: any = this.context?.data?.task;
  public taskForm: FormGroup = new FormGroup('');

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.taskForm = new FormGroup({
      title: new FormControl(this.task.title),
      description: new FormControl(this.task.description)
    });
  }

}
