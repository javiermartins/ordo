import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ErrorComponent } from './pages/error/error.component';
import { authGuard } from './guards/auth/auth.guard';
import { loginGuard } from './guards/login/login.guard';
import { LayoutComponent } from './components/layout/layout.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { ProjectComponent } from './pages/project/project.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: 'error', component: ErrorComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'new-project', component: NewProjectComponent },
            { path: ':projectId', component: ProjectComponent },
        ],
    }
];
