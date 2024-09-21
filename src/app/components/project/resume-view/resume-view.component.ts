import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiTextareaModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-resume-view',
  standalone: true,
  imports: [ReactiveFormsModule, TuiTextareaModule],
  templateUrl: './resume-view.component.html',
  styleUrl: './resume-view.component.scss'
})
export class ResumeViewComponent implements OnInit {
  @Input() project: any = null;

  public projectForm: FormGroup = new FormGroup('');

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.projectForm = new FormGroup({
      description: new FormControl(this.project?.description)
    });
  }

}
