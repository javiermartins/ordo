import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, INJECTOR, Input, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { TuiButton, TuiDialogOptions, TuiDialogService, TuiIcon, TuiDropdown, TuiDataList } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';
import { startWith, tap } from 'rxjs';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TaskDetailDialogComponent } from '../../../dialogs/task-detail-dialog/task-detail-dialog.component';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { FormsModule } from '@angular/forms';
import { TuiDataListDropdownManager } from '@taiga-ui/kit';
import { TuiLet } from '@taiga-ui/cdk';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [FormsModule, DragDropModule, TuiHeader, TuiIcon, TuiButton, TuiInputModule,
    TuiTextfieldControllerModule, TuiDropdown, TuiDataList, TuiDataListDropdownManager, TuiLet],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardViewComponent implements AfterViewInit {
  @Input() sections: any[] = [];
  @ViewChildren('taskContainer', { read: CdkDropList })
  public taskContainerLists: QueryList<CdkDropList> = new QueryList<CdkDropList>;

  public taskContainers: CdkDropList[] = [];
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);

  constructor(private cd: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.taskContainerLists.changes.pipe(
      startWith(true),
      tap(() => {
        this.taskContainers = this.taskContainerLists.toArray();
        this.cd.markForCheck();
        this.cd.detectChanges();
      }),
    ).subscribe();
  }

  isTaskPredicate(item: CdkDrag<any>) {
    if (item.data.id) return true;
    return false;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  addSection() {
    this.sections.push(
      {
        id: Math.random(),
        title: 'New section',
        tasks: []
      }
    );
  }

  deleteSection(deleteSection: any) {
    this.sections = this.sections.filter((section: any) => section.id != deleteSection.id);
  }

  addTask(section: any) {
    section.tasks.push({ id: Math.random(), title: '' });
  }

  openTask(section: any, task: any) {
    const dialogOptions: Partial<TuiDialogOptions<any>> = {
      appearance: 'task-detail-apperance',
      size: 'auto',
      closeable: false,
      dismissible: true,
      data: {
        task: task
      }
    }

    this.dialogs
      .open(new PolymorpheusComponent(TaskDetailDialogComponent, this.injector), dialogOptions)
      .subscribe({
        complete: () => {

        },
      });
  }

}
