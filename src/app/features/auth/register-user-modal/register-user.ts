import { Component, DestroyRef, EventEmitter, inject, Output, signal } from '@angular/core';
import { LoginCredentials } from '../../../shared/auth.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogRef, MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-register-user',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule, ReactiveFormsModule, MatDialogActions, MatDialogContent],
  templateUrl: './register-user.html',
  styleUrl: './register-user.scss',
})
export class RegisterUser {

  protected dialogRef = inject(MatDialogRef<RegisterUser>);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastrService = inject(ToastrService);
  private destroyRef = inject(DestroyRef);

  form!: FormGroup;
  //Controla o estado
  private isSendingSubject = new BehaviorSubject<boolean>(false);
  isSending$ = this.isSendingSubject.asObservable();
  errors = signal<string[]>([]);

  ngOnInit() {
    this.errors.set([]);
    this.initForm();
    this.form.markAllAsTouched();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      password: [null, [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
      email: [null, [Validators.email, Validators.required, Validators.maxLength(150), Validators.minLength(1)]],
    });
  }

  getErrorMessage(campo: string): string | undefined {
    const control = this.form.get(campo);

    if (!control || !control.errors) return undefined;

    if (control.hasError('required')) return 'Mandatory field.';

    if (control.hasError('email')) return 'Invalid email.';

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

  defineToolTipBtnSave(): string | null {
    return !this.form.valid ? 'The form is invalid.' : null;
  }

  onRegister(): void {
    this.isSendingSubject.next(true);
    if (this.form.invalid) return;
    this.authService
      .register(this.form.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSendingSubject.next(false)
        })
      )
      .subscribe({
        next: () => {
          this.toastrService.success(
            'Account created successfully!',
            'Success!'
          );
          this.dialogRef.close();
          this.dialogRef.close({
            email: this.form.value.email,
            password: this.form.value.password,
          });
        },
        error: (error) => {
          const backendErrors = error?.error?.errors;
          if (Array.isArray(backendErrors)) {
            this.errors.set(backendErrors);
          }
          this.toastrService.error(
            'An error occurred while creating the account.',
            'Error'
          );
        }
      });
  }
}
