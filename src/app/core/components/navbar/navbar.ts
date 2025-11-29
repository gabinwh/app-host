import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userName(): string | null {
    return this.authService.getUsernameFromToken();
  }

  logout(): void {
    this.authService.logout();
    this.toastrService.success("Logout successful!");
  }

  navigateToDashboard(): void {
    this.router.navigate(['/admin']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/admin/products']);
  }
}
