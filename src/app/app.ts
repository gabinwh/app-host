import { Component } from '@angular/core';
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
