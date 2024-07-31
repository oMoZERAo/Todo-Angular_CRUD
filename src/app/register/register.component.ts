import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  errorMessage: string | null = null;

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    const data = this.form.getRawValue();
    if (!data.username) {
      this.errorMessage = 'Please provide display name!';
      return;
    }
    this.authService
      .register(data.email, data.username, data.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          switch (err.code) {
            case 'auth/invalid-email':
              this.errorMessage = 'Invalid email!';
              break;
            case 'auth/missing-email':
              this.errorMessage = 'Please provide email!';
              break;
            case 'auth/missing-password':
              this.errorMessage = 'Please provide password!';
              break;
            case 'auth/weak-password':
              this.errorMessage =
                'Password length must be at least 6 characters!';
              break;
            case 'auth/email-already-in-use':
              this.errorMessage = 'Email already in use!';
              break;
            default:
              this.errorMessage = err.code;
              break;
          }
        },
      });
  }

  onGuest(): void {
    this.authService.guest().subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.errorMessage = err.code;
      },
    });
  }

  onCloseAlert(): void {
    this.errorMessage = null
  }
}
