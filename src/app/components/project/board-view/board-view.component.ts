import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, Input, QueryList, ViewChildren } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';
import { startWith, tap } from 'rxjs';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [DragDropModule, TuiHeader, TuiIcon, TuiButton],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss'
})
export class BoardViewComponent implements AfterViewInit {
  @Input() sections: any[] = [];
  @ViewChildren('taskContainer', { read: CdkDropList })
  public taskContainerLists: QueryList<CdkDropList> = new QueryList<CdkDropList>;

  taskContainers: CdkDropList[] = [];

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

  istaskPredicate(item: CdkDrag<any>) {
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

  addTask(section: any) {
    section.tasks.push({ id: Math.random(), title: 'new item' });
  }

  openTask() {
    console.log('open');
  }

}
