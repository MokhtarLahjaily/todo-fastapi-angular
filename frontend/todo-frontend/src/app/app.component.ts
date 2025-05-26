import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoStatsComponent } from './components/todo-stats/todo-stats.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoService } from './services/todo.service';
import { Todo, TodoCreate, TodoStats } from './models/todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    TodoFormComponent,
    TodoStatsComponent,
    TodoListComponent
  ]
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];
  stats: TodoStats = {
    total: 0,
    pending: 0,
    completed: 0,
    completion_rate: 0
  };

  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.loadTodos().subscribe({
      next: (todos: Todo[]) => {
        this.todos = todos;
        this.updateStats();
      },
      error: (error: Error) => {
        console.error('Error loading todos:', error);
        this.showError('Erreur lors du chargement des tâches');
      }
    });
  }

  onAddTodo(todo: TodoCreate) {
    this.todoService.createTodo(todo).subscribe({
      next: (newTodo) => {
        this.todos = [...this.todos, newTodo];
        this.updateStats();
        this.showSuccess('Tâche ajoutée avec succès');
      },
      error: (error: Error) => {
        console.error('Error creating todo:', error);
        this.showError('Erreur lors de l\'ajout de la tâche');
      }
    });
  }

  onToggleComplete(todo: Todo) {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(todo.id, updatedTodo).subscribe({
      next: (updated) => {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = updated;
          this.todos = [...this.todos];
          this.updateStats();
          this.showSuccess(`Tâche marquée comme ${updated.completed ? 'terminée' : 'en cours'}`);
        }
      },
      error: (error: Error) => {
        console.error('Error updating todo:', error);
        this.showError('Erreur lors de la mise à jour de la tâche');
      }
    });
  }

  onDeleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => {
        this.todos = this.todos.filter(t => t.id !== todo.id);
        this.updateStats();
        this.showSuccess('Tâche supprimée avec succès');
      },
      error: (error: Error) => {
        console.error('Error deleting todo:', error);
        this.showError('Erreur lors de la suppression de la tâche');
      }
    });
  }

  private updateStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const completion_rate = total > 0 ? (completed / total) * 100 : 0;

    this.stats = {
      total,
      pending,
      completed,
      completion_rate
    };
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}