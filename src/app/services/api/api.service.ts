import { Injectable } from '@angular/core';
import { Databases, ID } from 'appwrite';
import { environment } from '../../../environments/environment';
import { client } from '../../../lib/appwrite';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private databases: Databases;

  constructor() {
    this.databases = new Databases(client);
  }

  async getDocument(collectionId: string, documentId: string, queries?: any[]) {
    return await this.databases.getDocument(
      environment.DATABASE_ID,
      collectionId,
      documentId,
      queries
    );
  }

  async getDocuments(collectionId: string, queries?: any[]) {
    return await this.databases.listDocuments(
      environment.DATABASE_ID,
      collectionId,
      queries
    );
  }

  async createDocument(collectionId: string, documentId: string, data: any, permissions?: any[]) {
    await this.databases.createDocument(
      environment.DATABASE_ID,
      collectionId,
      documentId,
      data,
      permissions
    );
  }

  async deleteDocument(collectionId: string, documentId: string) {
    return await this.databases.deleteDocument(
      environment.DATABASE_ID,
      collectionId,
      documentId
    );
  }
}
