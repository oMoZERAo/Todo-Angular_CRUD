import { inject, Injectable } from '@angular/core';
import { TodoInterface } from '../interfaces/todos.interface';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodosFirebaseService {
  firestore = inject(Firestore);
  todosCollection = collection(this.firestore, 'todos');

  getTodos(userId: string): Observable<TodoInterface[]> {
    const todosQuery = query(
      this.todosCollection,
      where('userId', '==', userId)
    );
    return collectionData(todosQuery, { idField: 'id' }) as Observable<
      TodoInterface[]
    >;
  }

  addTodo(text: string, userId: string, createdAt: string): Observable<string> {
    const todoToCreate = { text, isCompleted: false, userId, createdAt };
    const promise = addDoc(this.todosCollection, todoToCreate).then(
      (response) => response.id
    );

    return from(promise);
  }

  editTodo(todoId: string, dataToUpdate: {text: string, isCompleted: boolean, createdAt: string, userId: string}): Observable<void> {
    const docRef = doc(this.firestore, 'todos/' + todoId);
    const promise = setDoc(docRef, dataToUpdate);

    return from(promise);
  }

  removeTodo(todoId: string): Observable<void> {
    const docRef = doc(this.firestore, 'todos/' + todoId);
    const promise = deleteDoc(docRef);

    return from(promise);
  }
}
