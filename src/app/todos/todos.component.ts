import { Component, inject, Input, OnInit } from '@angular/core';
import { TodoInterface } from '../../interfaces/todos.interface';
import { TodosService } from '../../services/todos.service';
import { TodosFirebaseService } from '../../services/todosFirebase.service';
import { AuthService } from '../../services/auth.service';
import { formatDate } from '../../utils/formatDate';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  authService = inject(AuthService);
  todosService = inject(TodosService);
  todosFirebaseService = inject(TodosFirebaseService);
  isLoading: boolean = true;
  text: string = '';
  status: boolean | null = null;
  contextMessage: string = '';

  ngOnInit(): void {
    this.isLoading = true;
    this.todosFirebaseService
      .getTodos(this.authService.currentUserSignal()?.userId!)
      .subscribe((todos) => {
        this.isLoading = false;
        this.todosService.inProgress.set(
          todos.filter((todo) => todo.isCompleted == false)
        );
        this.todosService.completed.set(
          todos.filter((todo) => todo.isCompleted == true)
        );
      });
  }

  onAdd(): void {
    this.isLoading = true;
    this.todosFirebaseService
      .addTodo(
        this.text,
        this.authService.currentUserSignal()?.userId!,
        formatDate(new Date())
      )
      .subscribe((addedTodoId) => {
        this.todosService.addTodo(this.text, addedTodoId);
        this.text = '';
        this.contextMessage = 'Add Successful';
        this.isLoading = false;
      });
  }

  onEdit(todo: TodoInterface): void {
    const dataToUpdate = {
      text: this.text,
      isCompleted: this.status!,
      createdAt: todo.createdAt,
      userId: todo.userId,
    };
    this.todosFirebaseService.editTodo(todo.id, dataToUpdate).subscribe(() => {
      this.todosService.editTodo(todo.id, this.text, this.status!);
      this.contextMessage = 'Update Successful';
    });
  }

  onRemove(todoId: string): void {
    this.todosFirebaseService.removeTodo(todoId).subscribe(() => {
      this.todosService.removeTodo(todoId);
      this.contextMessage = 'Remove Successful';
    });
  }

  onCloseMessage(): void {
    this.contextMessage = '';
  }

  onCloseModal(): void {
    this.text = '';
    this.status = null;
  }

  onSelected(value: boolean): void {
    this.status = value;
  }

  onEditButton(text: string, isCompleted: boolean): void {
    this.text = text;
    this.status = isCompleted;
  }
}
