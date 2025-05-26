import { Component, Input, Output, EventEmitter, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFabButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Todo, TodoCreate } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoService } from '../../services/todo.service';

interface SortOption {
  value: string;
  label: string;
}

type PriorityLevel = 'high' | 'medium' | 'low';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TodoItemComponent,
    TodoFormComponent,
    MatChipsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFabButton,
    MatDialogModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Output() todoDeleted = new EventEmitter<void>();
  @Output() todoUpdated = new EventEmitter<void>();
  @Output() todoAdded = new EventEmitter<Todo>();

  currentFilter: string = 'all';
  sortValue: string = 'created_at';
  loading = true;
  filteredTodos: Todo[] = [];
  isDarkMode = false;
  filterValue = '';
  showForm = false;
  sortOptions: SortOption[] = [
    { value: 'created_at', label: 'Date de création' },
    { value: 'due_date', label: 'Date d\'échéance' },
    { value: 'priority', label: 'Priorité' }
  ];

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadTodos();
    this.checkDarkMode();
  }

  toggleForm(): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '500px',
      maxHeight: '90vh',
      panelClass: this.isDarkMode ? 'dark-theme' : '',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onTodoAdded(result);
      }
    });
  }

  onTodoAdded(todo: TodoCreate): void {
    this.todoService.createTodo(todo).subscribe({
      next: (newTodo) => {
        this.todos = [...this.todos, newTodo];
        this.applyFilterAndSort();
        this.todoAdded.emit(newTodo);
      },
      error: (error) => {
        console.error('Error adding todo:', error);
      }
    });
  }

  loadTodos(): void {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.applyFilterAndSort();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.loading = false;
      }
    });
  }

  applyFilterAndSort(): void {
    let filtered = [...this.todos];

    // Appliquer le filtre
    if (this.currentFilter === 'pending') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (this.currentFilter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // Appliquer le tri
    filtered.sort((a, b) => {
      switch (this.sortValue) {
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'due_date':
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'priority':
          const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return 0;
      }
    });

    this.filteredTodos = filtered;
  }

  onFilterChange(value: string): void {
    this.currentFilter = value;
    this.applyFilterAndSort();
  }

  onSortChange(): void {
    this.applyFilterAndSort();
  }

  checkDarkMode(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  isOverdue(todo: Todo): boolean {
    if (!todo.due_date || todo.completed) return false;
    return new Date(todo.due_date) < new Date();
  }

  onTodoDeleted(): void {
    this.loadTodos();
  }

  onTodoUpdated(): void {
    this.applyFilterAndSort();
    this.todoUpdated.emit();
  }

  private updateTodoInList(updatedTodo: Todo): void {
    const index = this.todos.findIndex(t => t.id === updatedTodo.id);
    if (index !== -1) {
      this.todos[index] = updatedTodo;
      this.applyFilterAndSort();
    }
  }
}