import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TodoService } from '../../services/todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    TodoItemComponent
  ]
})
export class TodoListComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Output() toggleComplete = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<Todo>();

  loading = false;
  error: string | null = null;
  todos$;
  currentFilter: 'all' | 'pending' | 'completed' = 'all';

  constructor(private todoService: TodoService) {
    this.todos$ = this.todoService.todos$;
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.error = null;

    let completed: boolean | undefined;
    if (this.currentFilter === 'completed') {
      completed = true;
    } else if (this.currentFilter === 'pending') {
      completed = false;
    }

    this.todoService.loadTodos(completed).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Erreur chargement:', error);
        this.error = 'Erreur lors du chargement des tâches';
        this.loading = false;
      }
    });
  }

  onFilterChange(filter: 'all' | 'pending' | 'completed'): void {
    this.currentFilter = filter;
    this.loadTodos();
  }

  trackByFn(index: number, todo: Todo): number {
    return todo.id;
  }

  onToggleComplete(todo: Todo) {
    this.toggleComplete.emit(todo);
  }

  onDelete(todo: Todo) {
    this.delete.emit(todo);
  }
}