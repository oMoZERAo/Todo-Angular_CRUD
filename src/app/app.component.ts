import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.isLoading.set(true);
    this.authService.user$.subscribe((user: User) => {
      if (user) {
        if (user.email == null && user.displayName == null) {
          this.authService.currentUserSignal.set({
            userId: user.uid,
            email: null!,
            username: 'Guest',
          });
        } else {
          this.authService.currentUserSignal.set({
            userId: user.uid,
            email: user.email!,
            username: user.displayName!,
          });
        }
      } else {
        this.authService.currentUserSignal.set(null);
      }

      this.authService.isLoading.set(false);
    });
  }

  title: string = 'Todo-Angular';
}
