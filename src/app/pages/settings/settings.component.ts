import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiDataList, TuiLabel } from '@taiga-ui/core';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiInputModule, TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { AuthService } from '../../services/auth/auth.service';
import { User } from "firebase/auth";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule, TuiInputModule, TuiLabel, TuiTextfieldControllerModule,
    TuiDataList, TuiDataListWrapper, TuiSelectModule, TranslateModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  public user: User;
  public urlForm: FormGroup;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getUser();
    this.initForm();
  }

  getUser() {
    this.user = this.authService.user;
  }

  initForm() {
    this.urlForm = new FormGroup({
      userName: new FormControl({ value: this.user.displayName, disabled: true }),
      email: new FormControl({ value: this.user.email, disabled: true })
    });
  }

}
