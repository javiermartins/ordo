import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { account } from '../../../lib/appwrite';
import { OAuthProvider } from 'appwrite';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TuiButton],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public account: any;

  constructor() {
    this.getUserData();
  }

  async getUserData() {
    this.account = await account.get();
  }

  async loginWithGoogle() {
    try {
      await account.createOAuth2Session(OAuthProvider.Google, 'http://localhost:4200/', 'http://localhost:4200/error');
    } catch (error) {
      console.error(error)
    }
  }


}
