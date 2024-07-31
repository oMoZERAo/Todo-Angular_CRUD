import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  errorMessage: string | null = null;

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    const data = this.form.getRawValue();
    this.authService.login(data.email, data.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        switch (err.code) {
          case 'auth/invalid-email':
            this.errorMessage = 'Please provide email!';
            break;
          case 'auth/missing-password':
            this.errorMessage = 'Please provide password!';
            break;
          case 'auth/invalid-credential':
            this.errorMessage = 'Email or password invalid!';
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
}
