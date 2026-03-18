import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { DocumentFormComponent } from './pages/document-form/document-form.component';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'documents', component: DocumentsComponent, canActivate: [authGuard] },
  { path: 'documents/new', component: DocumentFormComponent, canActivate: [authGuard] },
  { path: 'documents/edit/:id', component: DocumentFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];