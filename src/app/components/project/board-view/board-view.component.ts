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
import { Project, Section, Task } from '../../../models/project.model';
import { ProjectsService } from '../../../services/projects/projects.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from '../../../../environments/environment';

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
  @Input() project: Project;
  @ViewChildren('taskContainer', { read: CdkDropList })
  public taskContainerLists: QueryList<CdkDropList> = new QueryList<CdkDropList>;

  public taskContainers: CdkDropList[] = [];
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);

  constructor(
    private projectService: ProjectsService,
    private cd: ChangeDetectorRef,
    private firestore: AngularFirestore
  ) { }

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

  dropSection(event: CdkDragDrop<Section[]>) {
    this.transferArrayItem(event);
    this.updateSectionOrder(event.container.data);
  }

  updateSectionOrder(items: Section[]): void {
    const batch = this.firestore.firestore.batch();

    items.forEach((item, index) => {
      const { id, tasks, ...sectionData } = item;
      const docRef = this.firestore.collection(`${environment.PROJECTS_COLLECTION}/${this.project.id}/${environment.SECTIONS_COLLECTION}`).doc(id).ref;
      batch.set(docRef, { ...sectionData, order: index });
    });

    batch.commit().then();
  }

  updateTaskOrder(containerId: string, items: Task[]): void {
    const batch = this.firestore.firestore.batch();

    items.forEach((item, index) => {
      const { id, ...taskData } = item;
      const docRef = this.firestore.collection(`${environment.PROJECTS_COLLECTION}/${this.project.id}/${environment.SECTIONS_COLLECTION}/${containerId}/${environment.TASKS_COLLECTION}`).doc(id).ref;
      batch.set(docRef, { ...taskData, order: index });
    });

    batch.commit().then();
  }

  dropTask(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateTaskOrder(event.container.id, event.container.data);
    } else {
      this.transferTask(event);
    }
  }

  transferTask(event: any) {
    const taskToTransfer = event.previousContainer.data[event.previousIndex];

    this.transferArrayItem(event);

    this.updateTaskOrder(event.previousContainer.id, event.previousContainer.data);
    this.updateTaskOrder(event.container.id, event.container.data);

    this.deleteTask(event.previousContainer.id, taskToTransfer.id);
  }

  transferArrayItem(event: any) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }

  addSection() {
    const maxOrder = this.project.sections.reduce((max, section) => Math.max(max, section.order || 0), 0);
    const section = {
      order: maxOrder + 1
    }
    this.projectService.addSection(this.project.id, section);
  }

  updateSectionTitle(section: Section) {
    this.projectService.updateSection(this.project.id, section);
  }

  deleteSection(section: Section) {
    this.projectService.deleteSection(this.project.id, section.id);
  }

  deleteTask(sectionId: string, taskId: string) {
    this.projectService.deleteTask(this.project.id, sectionId, taskId).then();
  }

  addTask(section: Section) {
    const maxOrder = section.tasks.reduce((max, task) => Math.max(max, task.order || 0), 0);
    const task = {
      order: maxOrder + 1
    };
    this.projectService.addTask(this.project.id, section.id, task);
  }

  openTask(section: Section, task: Task) {
    const dialogOptions: Partial<TuiDialogOptions<any>> = {
      appearance: 'task-detail-apperance',
      size: 'auto',
      closeable: false,
      dismissible: true,
      data: {
        projectId: this.project.id,
        sectionId: section.id,
        task: task
      }
    }

    this.dialogs
      .open(new PolymorpheusComponent(TaskDetailDialogComponent, this.injector), dialogOptions)
      .subscribe();
  }

}
