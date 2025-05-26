import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TodoService } from './services/todo.service';
import { Todo, TodoStats } from './models/todo.model';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TodoFormComponent,
    TodoListComponent,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Todo App';
  todos: Todo[] = [];
  isDarkMode = false;
  stats: TodoStats = {
    total: 0,
    pending: 0,
    completed: 0,
    completion_rate: 0
  };

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
    this.loadStats();
    this.checkDarkMode();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  private checkDarkMode(): void {
    this.isDarkMode = document.body.classList.contains('dark-theme');
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
      }
    });
  }

  loadStats(): void {
    this.todoService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  onAddTodo(todo: Todo): void {
    this.todoService.createTodo(todo).subscribe({
      next: () => {
        this.loadTodos();
        this.loadStats();
      },
      error: (error) => {
        console.error('Error creating todo:', error);
      }
    });
  }

  onTodoDeleted(): void {
    this.loadTodos();
    this.loadStats();
  }

  onTodoUpdated(): void {
    this.loadTodos();
    this.loadStats();
  }
}