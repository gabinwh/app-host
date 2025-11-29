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
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
  }
];
