import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, INJECTOR, Input, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { TuiButton, TuiDialogOptions, TuiDialogService, TuiIcon, TuiDropdown, TuiDataList } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';
import { debounceTime, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TaskDetailDialogComponent } from '../../../dialogs/task-detail-dialog/task-detail-dialog.component';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { FormsModule } from '@angular/forms';
import { TuiCheckbox, TuiDataListDropdownManager } from '@taiga-ui/kit';
import { Project, Section, Task } from '../../../models/project.model';
import { ProjectsService } from '../../../services/projects/projects.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ConfirmDeleteComponent } from '../../../dialogs/confirm-delete/confirm-delete.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [FormsModule, DragDropModule, TuiHeader, TuiIcon, TuiButton, TuiInputModule,
    TuiTextfieldControllerModule, TuiDropdown, TuiDataList, TuiDataListDropdownManager,
    TuiCheckbox, CommonModule, TranslateModule
  ],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() project: Project;
  @ViewChildren('taskContainer', { read: CdkDropList })
  public taskContainerLists: QueryList<CdkDropList> = new QueryList<CdkDropList>;

  public taskContainers: CdkDropList[] = [];
  public sectionToFocusId: string = null;
  public isAnyInputActive: boolean = false;
  public focusedTaskIndex: number | null = null;
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);

  private sectionUpdate$ = new Subject<Section>();
  private taskUpdate$ = new Subject<{ section: Section, task: Task }>();
  private unsubscribe$ = new Subject<void>();

  constructor(
    private projectService: ProjectsService,
    private cd: ChangeDetectorRef,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.setupUpdateListener(
      this.sectionUpdate$,
      (section) => this.projectService.updateSection(this.project.id, section)
    );

    this.setupUpdateListener(
      this.taskUpdate$,
      ({ section, task }) => this.projectService.updateTask(this.project.id, section.id, task)
    );
  }

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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setupUpdateListener<T>(subject: Subject<T>, updateFn: (data: T) => Promise<void>) {
    subject
      .pipe(
        debounceTime(500),
        switchMap(updateFn),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        error: (err) => console.error('Error updating:', err),
      });
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
    };
    this.projectService.addSection(this.project.id, section).then((section) => {
      this.focusInputSection(section);
    });
  }

  focusInputSection(section: any) {
    this.sectionToFocusId = section.id;
    setTimeout(() => {
      const inputElement = document.getElementById(section.id);
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  }

  focusInputTask(task: Task) {
    const inputElement = document.getElementById(task.id);
    if (inputElement) {
      inputElement.focus();
    }
  }

  updateSectionTitle(section: Section) {
    this.projectService.updateSection(this.project.id, section);
  }

  taskCompleted(event: Event, section: Section, task: Task) {
    event.stopPropagation();
    task.completed = !task.completed;
    this.updateTask(section, task);
  }

  updateTask(section: Section, task: Task) {
    this.taskUpdate$.next({ section, task });
  }

  onFocusTask(index: number) {
    this.focusedTaskIndex = index;
  }

  onBlurTask() {
    this.focusedTaskIndex = null;
  }

  prevent(event: Event) {
    event.stopPropagation();
  }

  confirmDeleteSection(section: Section) {
    const dialogOptions: Partial<TuiDialogOptions<any>> = {
      closeable: false,
      dismissible: true,
      data: {
        header: `Are you sure you want to delete "${section.title}"?`,
        description: 'This action will permanently delete the section and all associated tasks.'
      }
    }

    this.dialogs
      .open(new PolymorpheusComponent(ConfirmDeleteComponent, this.injector), dialogOptions)
      .subscribe({
        next: async (value: any) => {
          if (value) {
            this.deleteSection(section);
          }
        },
      });
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
      order: maxOrder + 1,
      completed: false,
      createdDate: new Date()
    };
    this.projectService.addTask(this.project.id, section.id, task).then((newTask) => {
      this.focusInputTask(newTask);
    });
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

  onInputFocus() {
    this.isAnyInputActive = true;
  }

  onInputBlur() {
    this.isAnyInputActive = false;
  }

}
