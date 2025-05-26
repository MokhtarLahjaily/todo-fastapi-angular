import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 0) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le serveur est en cours d\'exécution.';
      } else if (error.status === 404) {
        errorMessage = 'La ressource demandée n\'existe pas.';
      } else if (error.status === 500) {
        errorMessage = 'Erreur interne du serveur.';
      } else if (error.error && error.error.detail) {
        errorMessage = error.error.detail;
      }
    }
    
    console.error('Erreur détaillée:', error);
    return throwError(() => new Error(errorMessage));
  }

  loadTodos(completed?: boolean): Observable<Todo[]> {
    const url = completed !== undefined ? `${this.apiUrl}?completed=${completed}` : this.apiUrl;
    return this.http.get<Todo[]>(url).pipe(
      tap(todos => this.todosSubject.next(todos)),
      catchError(this.handleError)
    );
  }

  createTodo(todo: TodoCreate): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      tap(newTodo => {
        const currentTodos = this.todosSubject.value;
        this.todosSubject.next([...currentTodos, newTodo]);
      }),
      catchError(this.handleError)
    );
  }

  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}`, todo).pipe(
      tap(updatedTodo => {
        const currentTodos = this.todosSubject.value;
        const index = currentTodos.findIndex(t => t.id === id);
        if (index !== -1) {
          currentTodos[index] = updatedTodo;
          this.todosSubject.next([...currentTodos]);
        }
      }),
      catchError(this.handleError)
    );
  }

  toggleTodo(id: number, completed: boolean): Observable<Todo> {
    return this.updateTodo(id, { completed });
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTodos = this.todosSubject.value;
        this.todosSubject.next(currentTodos.filter(t => t.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  getStats(): Observable<TodoStats> {
    return this.http.get<TodoStats>(`${this.apiUrl}/stats/summary`).pipe(
      catchError(this.handleError)
    );
  }
}