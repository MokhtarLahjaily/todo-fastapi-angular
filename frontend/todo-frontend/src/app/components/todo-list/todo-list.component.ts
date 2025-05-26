import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Todo, Priority } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    TodoItemComponent,
    MatChipsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Output() todoDeleted = new EventEmitter<void>();
  @Output() todoUpdated = new EventEmitter<void>();

  currentFilter: 'all' | 'pending' | 'completed' = 'all';
  sortBy: 'dueDate' | 'priority' | 'createdAt' = 'dueDate';
  loading = false;
  filteredTodos: Todo[] = [];
  isDarkMode = false;

  ngOnInit() {
    this.applyFilterAndSort();
    this.checkDarkMode();
  }

  ngOnChanges() {
    this.applyFilterAndSort();
  }

  private checkDarkMode() {
    this.isDarkMode = document.body.classList.contains('dark-theme');
  }

  onFilterChange(filter: 'all' | 'pending' | 'completed'): void {
    this.currentFilter = filter;
    this.applyFilterAndSort();
  }

  onSortChange(): void {
    this.applyFilterAndSort();
  }

  private applyFilterAndSort(): void {
    // Apply filter
    this.filteredTodos = this.todos.filter(todo => {
      switch (this.currentFilter) {
        case 'pending':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    });

    // Apply sort
    this.filteredTodos.sort((a, b) => {
      switch (this.sortBy) {
        case 'dueDate':
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'priority':
          return this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority);
        case 'createdAt':
          if (!a.created_at) return 1;
          if (!b.created_at) return -1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });
  }

  private getPriorityWeight(priority: Priority): number {
    switch (priority) {
      case Priority.HIGH:
        return 3;
      case Priority.MEDIUM:
        return 2;
      case Priority.LOW:
        return 1;
      default:
        return 0;
    }
  }

  getPriorityLabel(priority: Priority): string {
    switch (priority) {
      case Priority.HIGH:
        return 'Haute';
      case Priority.MEDIUM:
        return 'Moyenne';
      case Priority.LOW:
        return 'Basse';
      default:
        return priority;
    }
  }

  isOverdue(todo: Todo): boolean {
    if (!todo.due_date || todo.completed) return false;
    return new Date(todo.due_date) < new Date();
  }
}