import { Injectable } from '@angular/core';
import { account, client } from '../../../lib/appwrite';
import { Databases, Query } from 'appwrite';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private databases: Databases;

  constructor() {
    this.databases = new Databases(client);
  }

  async isAuthenticated() {
    try {
      await this.getUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUser() {
    return await account.get();
  }

  async checkAndCreateUser() {
    const user: any = await account.get();
    try {
      const response = await this.databases.listDocuments(environment.DATABASE_ID, environment.USERS_COLLETION, [Query.equal('$id', user.$id)]);
      if (response.documents.length === 0) {
        const data = {
          name: user.name,
          email: user.email
        }

        await this.databases.createDocument(environment.DATABASE_ID, environment.USERS_COLLETION, user.$id, data);
      }
    } catch (error) {
      console.error('Error when verifying or creating the user: ', error);
    }
  }

  async logout() {
    await account.deleteSession('current');
  }
}
