import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TodoService } from './services/todo.service';
import { Todo, TodoCreate, TodoStats } from './models/todo.model';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { Stats } from './models/stats.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    TodoFormComponent,
    TodoListComponent,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Todo App';
  todos: Todo[] = [];
  stats: TodoStats = {
    total: 0,
    pending: 0,
    completed: 0,
    completion_rate: 0
  };
  isDarkMode = false;

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadTodos();
    this.loadStats();
    this.checkDarkMode();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-theme', this.isDarkMode);
      localStorage.setItem('darkMode', this.isDarkMode.toString());
    }
  }

  private checkDarkMode(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        this.isDarkMode = savedMode === 'true';
        document.body.classList.toggle('dark-theme', this.isDarkMode);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDarkMode = prefersDark;
        document.body.classList.toggle('dark-theme', prefersDark);
      }
    }
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  loadStats(): void {
    this.todoService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  onTodoAdded(todo: Todo): void {
    this.todos = [...this.todos, todo];
    this.loadStats();
  }

  onTodoDeleted(): void {
    this.loadTodos();
    this.loadStats();
  }

  onTodoUpdated(): void {
    this.loadTodos();
    this.loadStats();
  }

  openAddTodoDialog(): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '500px',
      panelClass: this.isDarkMode ? 'dark-theme' : ''
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.createTodo(result).subscribe({
          next: (newTodo) => {
            this.todos = [...this.todos, newTodo];
            this.loadStats();
          },
          error: (error) => {
            console.error('Error adding todo:', error);
          }
        });
      }
    });
  }
}