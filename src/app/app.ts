import { Component, ComponentRef, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MicroFrontendService } from './core/services/micro-frontend.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  @ViewChild('store', { read: ViewContainerRef, static: true }) storeContainer!: ViewContainerRef;

  private storeComponentRef: ComponentRef<any> | null = null;

  constructor(private microFrontendService: MicroFrontendService) { }

  async ngOnInit(): Promise<void> {
    try {
      const storeModule = await this.microFrontendService.loadRemoteComponent(4201, 'my-angular-store');
      this.storeContainer.clear();
      this.storeComponentRef = this.storeContainer.createComponent(storeModule.App)
    } catch (err) {
      console.error('Erro ao carregar o componente remoto:', err)
    }
  }

  ngOnDetroy(): void {
    if (this.storeComponentRef) {
      this.storeComponentRef.destroy();
    }
  }
}
