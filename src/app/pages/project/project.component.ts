import { Component } from '@angular/core';
import { TuiHeader } from '@taiga-ui/layout';
import { BoardViewComponent } from '../../components/project/board-view/board-view.component';
import { TuiDataListDropdownManager, TuiTabs } from '@taiga-ui/kit';
import { ResumeViewComponent } from '../../components/project/resume-view/resume-view.component';
import { TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [TuiHeader, TuiTabs, BoardViewComponent, ResumeViewComponent,
    TuiDropdown, TuiDataList, TuiDataListDropdownManager, TuiIcon, TuiButton
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  protected activetab = 2;

  public exampleproject = {
    "id": "683472895798hdo938",
    "title": "Project 1",
    "description": "Description of project 1",
    "sections": [
      {
        "id": 1,
        "title": 'To do',
        "tasks": [
          { id: 1, title: 'Get to work' },
          { id: 2, title: 'Pick up groceries' },
          { id: 2, title: 'Go home' }
        ]
      },
      {
        "id": 2,
        "title": 'Done',
        "tasks": [
          { id: 1, title: 'Get up' },
          { id: 2, title: 'Brush teeth' },
          { id: 2, title: 'Take a shower' }
        ]
      }
    ]
  }

  constructor(
    private router: Router
  ) { }

  deleteProject() {
    //TODO: delete
    this.router.navigate(['/dashboard']);
  }

}