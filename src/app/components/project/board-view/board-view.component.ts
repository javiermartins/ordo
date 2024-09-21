import { Component, Input, input } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TuiHeader } from '@taiga-ui/layout';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [DragDropModule, TuiHeader, TuiIcon, TuiButton],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss'
})
export class BoardViewComponent {
  @Input() sections: any[] = [];

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
