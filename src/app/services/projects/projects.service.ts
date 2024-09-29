import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, map, mergeMap, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Project, Section, Task } from '../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore
  ) { }

  loadProjects() {
    const user = this.authService.user;

    this.afs.collection(environment.PROJECTS_COLLECTION, ref => ref.where('ownerId', '==', user?.uid))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data as Object };
        }))
      ).subscribe((projects: any[]) => {
        this.projectsSubject.next(projects);
      });
  }

  createNewProject(project: Project) {
    return this.afs.collection(environment.PROJECTS_COLLECTION).add(project);
  }

  getProject(projectId: string) {
    return this.afs.doc(`${environment.PROJECTS_COLLECTION}/${projectId}`).valueChanges().pipe(
      switchMap(project => {
        const sectionsUrl = `${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}`;
        const sections$ = this.afs.collection(sectionsUrl).snapshotChanges().pipe(
          map(actions =>
            actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data as {} };
            })
          )
        );

        const sectionsWithTasks$ = sections$.pipe(
          mergeMap(sections => {
            if (sections.length === 0) {
              return of([]);
            }
            return combineLatest(
              sections.map(section =>
                this.afs.collection(`${sectionsUrl}/${section.id}/${environment.TASKS_COLLECTION}`).snapshotChanges().pipe(
                  map(taskActions => {
                    const tasks = taskActions.map(taskAction => {
                      const taskData = taskAction.payload.doc.data();
                      const taskId = taskAction.payload.doc.id;
                      return { id: taskId, ...taskData as {} };
                    });
                    return { ...section, tasks };
                  })
                )
              )
            );
          })
        );

        return combineLatest([of(project), sectionsWithTasks$]).pipe(
          map(([project, sectionsWithTasks]) => ({
            id: projectId,
            ...project as {},
            sections: sectionsWithTasks
          }))
        );
      })
    );
  }

  deleteProject(projectId: string) {
    return this.afs.doc(`${environment.PROJECTS_COLLECTION}/${projectId}`).delete();
  }

  async updateDescription(projectId: string, newDescription: string) {
    this.afs.doc(`${environment.PROJECTS_COLLECTION}/${projectId}`).update({ description: newDescription });
  }

  addSection(projectId: string, section: Section | {}) {
    return this.afs.collection(`${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}`).add(section);
  }

  deleteSection(projectId: string, sectionId: string) {
    return this.afs.doc(`${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}/${sectionId}`).delete();
  }

  addTask(projectId: string, sectionId: string, task: Task | {}) {
    return this.afs.collection(`${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}/${sectionId}/${environment.TASKS_COLLECTION}`).add(task);
  }

  deleteTask(projectId: string, sectionId: string, taskId: string) {
    return this.afs.doc(`${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}/${sectionId}/${environment.TASKS_COLLECTION}/${taskId}`).delete();
  }
}
