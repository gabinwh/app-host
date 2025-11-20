import { Component, ComponentRef, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { MicroFrontendService } from './core/services/mfe/micro-frontend.service';
import { NavbarComponent } from './core/components/navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
