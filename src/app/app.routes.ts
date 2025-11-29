import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'angular-store',
    loadChildren: () =>
      loadRemoteModule('my-angular-store', './AppRoutingModule')
        .then(m => m.AppRoutingModule)
  },
  {
    path: 'dashboard-admin',
    loadChildren: () =>
      loadRemoteModule('dashboard-admin', './AppRoutingModule')
        .then(m => m.Routes)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
  }
];
