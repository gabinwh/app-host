import { loadRemoteModule } from '@angular-architects/native-federation';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MicroFrontendService {

  async loadRemoteComponent(port: number, remoteName: string) {
    try {
      return await loadRemoteModule({
        exposedModule: './Component',
        remoteName,
        remoteEntry: `http://localhost:${port}/remoteEntry.json`,
        fallback: 'unauthorized'
      })
    } catch (err) {
      console.error(`Erro ao carregar ${remoteName}`, err);
      throw err;
    }
  }
}
