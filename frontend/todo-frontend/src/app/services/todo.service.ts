import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Todo, TodoCreate, TodoStats } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:8000/todos';
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur détaillée:', error);
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      map(todos => todos.map(todo => ({
        ...todo,
        created_at: todo.created_at ? new Date(todo.created_at) : undefined,
        updated_at: todo.updated_at ? new Date(todo.updated_at) : undefined,
        due_date: todo.due_date ? new Date(todo.due_date) : undefined
      }))),
      catchError(this.handleError)
    );
  }

  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      map(todo => ({
        ...todo,
        created_at: todo.created_at ? new Date(todo.created_at) : undefined,
        updated_at: todo.updated_at ? new Date(todo.updated_at) : undefined,
        due_date: todo.due_date ? new Date(todo.due_date) : undefined
      })),
      catchError(this.handleError)
    );
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      map(newTodo => ({
        ...newTodo,
        created_at: newTodo.created_at ? new Date(newTodo.created_at) : undefined,
        updated_at: newTodo.updated_at ? new Date(newTodo.updated_at) : undefined,
        due_date: newTodo.due_date ? new Date(newTodo.due_date) : undefined
      })),
      catchError(this.handleError)
    );
  }

  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo).pipe(
      map(updatedTodo => ({
        ...updatedTodo,
        created_at: updatedTodo.created_at ? new Date(updatedTodo.created_at) : undefined,
        updated_at: updatedTodo.updated_at ? new Date(updatedTodo.updated_at) : undefined,
        due_date: updatedTodo.due_date ? new Date(updatedTodo.due_date) : undefined
      })),
      catchError(this.handleError)
    );
  }

  toggleTodo(id: number, completed: boolean): Observable<Todo> {
    return this.updateTodo(id, { completed });
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getStats(): Observable<TodoStats> {
    return this.http.get<TodoStats>(`${this.apiUrl}/stats/summary`).pipe(
      catchError(this.handleError)
    );
  }
}