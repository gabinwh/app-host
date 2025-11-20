import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadChildren: () =>
      loadRemoteModule('my-angular-store', './AppRoutingModule')
        .then(m => m.AppRoutingModule)
  },
];
