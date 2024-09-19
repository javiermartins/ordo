import { Injectable } from '@angular/core';
import { Query } from 'appwrite';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projectsSubject = new BehaviorSubject<any[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.loadProjects();
  }

  public async loadProjects() {
    const user = await this.authService.getUser();

    try {
      const projects = await this.apiService.getDocuments(environment.PROJECTS_COLLECTION, [Query.equal('owner_id', user.$id)]);

      this.projectsSubject.next(projects.documents);
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  }
}
