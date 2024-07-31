import { inject, Injectable, signal } from '@angular/core';
import { TodoInterface } from '../interfaces/todos.interface';
import { AuthService } from './auth.service';
import { formatDate } from '../utils/formatDate';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  authService = inject(AuthService);
  inProgress = signal<TodoInterface[]>([]);
  completed = signal<TodoInterface[]>([]);

  addTodo(id: string, text: string): void {
    const newTodo: TodoInterface = {
      id,
      text,
      isCompleted: false,
      createdAt: formatDate(new Date()),
      userId: this.authService.currentUserSignal()?.userId!,
    };

    this.inProgress.update((todos) => [...todos, newTodo]);
  }

  editTodo(id: string, text: string, isCompleted: boolean): void {
    this.inProgress.update((todos) =>
      todos
        .map((todo) => (todo.id === id ? { ...todo, text, isCompleted } : todo))
        .filter((todo) => todo.isCompleted == false)
    );
    this.completed.update((todos) =>
      todos
        .map((todo) => (todo.id === id ? { ...todo, text, isCompleted } : todo))
        .filter((todo) => todo.isCompleted == true)
    );
  }

  removeTodo(id: string): void {
    this.inProgress.update((todos) => todos.filter((todo) => todo.id !== id));
    this.completed.update((todos) => todos.filter((todo) => todo.id !== id));
  }
}
