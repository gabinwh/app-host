import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RegisterUser } from '../register-user-modal/register-user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private toastrService = inject(ToastrService);
  private routeActivated = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  // Reativos para estado
  private isSendingSubject = new BehaviorSubject<boolean>(false);
  isSending$ = this.isSendingSubject.asObservable();
  private isCredentialsLoadingSubject = new BehaviorSubject<boolean>(false);
  isCredentialsLoading$ = this.isCredentialsLoadingSubject.asObservable();
  private credentialsSubject = new BehaviorSubject<any[]>([]);
  credentials$ = this.credentialsSubject.asObservable();
  // Reativo para mensagem de erro
  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessageSubject.asObservable();
  //
  form!: FormGroup;
  private returnUrl: string | null = null;

  ngOnInit() {
    this.initForm();
    this.form.markAllAsTouched();
    this.returnUrl =
      this.routeActivated.snapshot.queryParamMap.get('returnUrl');
  }

  private initForm(): void {
    this.form = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(100),
          Validators.minLength(1),
        ],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(3),
        ],
      ],
    });
  }

  getErrorMessage(campo: string): string | undefined {
    const control = this.form.get(campo);

    if (!control || !control.errors) return undefined;

    if (control.hasError('required')) return 'Mandatory field.';

    if (control.hasError('maxlength')) {
      const erro = control.getError('maxlength');
      return `Maximum ${erro.requiredLength} characters allowed.`;
    }

    if (control.hasError('minlength')) {
      const erro = control.getError('minlength');
      return `Minimum ${erro.requiredLength} characters required.`;
    }

    return undefined;
  }

  onLogin(): void {
    if (!this.form.valid) return;
    this.isSendingSubject.next(true);
    this.authService
      .login(this.form.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSendingSubject.next(false)
        })
      )
      .subscribe({
        next: (data) => {
          this.errorMessageSubject.next(null);
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate(['angular-store/home']);
          }
          this.toastrService.success('Login successful!');
        },
        error: (error) => {
          this.errorMessageSubject.next('Invalid username or password. Please try again.');
          this.toastrService.error('Unable to login!');
        }
      });
  }

  openRegisterModal(): void {
    const dialogRef = this.dialog.open(RegisterUser, {
      disableClose: true,
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((credentials) => {
        if (credentials) {
          this.form.patchValue({
            email: credentials.email,
            password: credentials.password
          });

          this.toastrService.success('Registration successful! You can now log in.');
        }
      });
  }

}
