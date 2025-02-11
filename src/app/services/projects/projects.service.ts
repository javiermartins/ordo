import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, debounceTime, lastValueFrom, map, mergeMap, of, switchMap } from 'rxjs';
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

  async getProjects() {
    const user = this.authService.user;
    if (user) {
      return await lastValueFrom(this.afs.collection(environment.PROJECTS_COLLECTION, ref => ref.where('ownerId', '==', user.uid)).get()).then((res) => {
        return res.docs.map(d => d.data());
      });
    } else {
      return [];
    }
  }

  loadProjects() {
    const user = this.authService.user;

    if (user) {
      this.afs.collection(environment.PROJECTS_COLLECTION, ref => ref.where('ownerId', '==', user.uid))
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
            }).sort((a: any, b: any) => {
              return a.order - b.order;
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
                this.afs.collection(`${sectionsUrl}/${section.id}/${environment.TASKS_COLLECTION}`).snapshotChanges().pipe(debounceTime(10),
                  map(taskActions => {
                    const tasks = taskActions.map(taskAction => {
                      const taskData = taskAction.payload.doc.data();
                      const taskId = taskAction.payload.doc.id;
                      return { id: taskId, ...taskData as {} };
                    });

                    tasks.sort((a: any, b: any) => a.order - b.order);

                    return { ...section, tasks };
                  })
                )
              )
            );
          })
        );

        return combineLatest([of(project), sectionsWithTasks$]).pipe(debounceTime(10),
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

  updateProject(project: Project) {
    const { id, sections, ...updateData } = project;
    this.afs.doc(`${environment.PROJECTS_COLLECTION}/${id}`).update(updateData);
  }

  addSection(projectId: string, section: {}) {
    return this.afs.collection(`${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}`).add(section);
  }

  updateSection(projectId: string, section: Section) {
    return this.afs.doc(`${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}/${section.id}`).update(section);
  }

  async deleteSection(projectId: string, sectionId: string): Promise<any> {
    const sectionDocPath = `${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}/${sectionId}`;
    const tasksCollectionPath = `${sectionDocPath}/tasks`;

    return lastValueFrom(this.afs
      .collection(tasksCollectionPath)
      .get()).then(snapshot => {
        const deleteTasksPromises = snapshot.docs.map(doc =>
          this.afs.doc(`${tasksCollectionPath}/${doc.id}`).delete()
        );
        return Promise.all(deleteTasksPromises);
      })
      .then(() => {
        return this.afs.doc(sectionDocPath).delete();
      });
  }

  async addTask(projectId: string, sectionId: string, task: {}) {
    try {
      const docRef = await this.afs.collection(`${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}/${sectionId}/${environment.TASKS_COLLECTION}`).add(task);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() as any };
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }


  updateTask(projectId: string, sectionId: string, task: Task) {
    return this.afs.doc(`${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}/${sectionId}/${environment.TASKS_COLLECTION}/${task.id}`).update(task);
  }

  deleteTask(projectId: string, sectionId: string, taskId: string) {
    return this.afs.doc(`${environment.PROJECTS_COLLECTION}/${projectId}/${environment.SECTIONS_COLLECTION}/${sectionId}/${environment.TASKS_COLLECTION}/${taskId}`).delete();
  }
}
