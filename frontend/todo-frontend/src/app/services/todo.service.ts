import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, TodoCreate, TodoUpdate, TodoStats } from '../models/todo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: TodoCreate): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  updateTodo(id: number, todo: TodoUpdate): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<TodoStats> {
    return this.http.get<TodoStats>(`${this.apiUrl}/stats/summary`);
  }

  toggleTodoStatus(id: number, completed: boolean): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}`, { completed });
  }

  updateTodoPosition(id: number, position: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}`, { position });
  }
}