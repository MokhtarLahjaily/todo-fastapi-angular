import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoStatsComponent } from './components/todo-stats/todo-stats.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoService } from './services/todo.service';
import { NotificationService } from './services/notification.service';
import { ThemeService } from './services/theme.service';
import { Todo, TodoCreate, TodoStats } from './models/todo.model';
import { Observable } from 'rxjs';

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
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    TodoFormComponent,
    TodoStatsComponent,
    TodoListComponent
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
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
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private dialog: MatDialog
  ) {
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit() {
    this.loadTodos();
    this.loadStats();
  }

  loadTodos() {
    this.todoService.loadTodos().subscribe({
      next: (todos: Todo[]) => {
        this.todos = todos;
        this.updateStats();
      },
      error: (error: Error) => {
        console.error('Error loading todos:', error);
        this.notificationService.error('Erreur lors du chargement des tâches');
      }
    });
  }

  loadStats() {
    this.todoService.getStats().subscribe({
      next: (stats: TodoStats) => {
        this.stats = stats;
      },
      error: (error: Error) => {
        console.error('Error loading stats:', error);
        this.notificationService.error('Erreur lors du chargement des statistiques');
      }
    });
  }

  onAddTodo(todo: TodoCreate) {
    this.todoService.createTodo(todo).subscribe({
      next: (newTodo) => {
        this.todos = [...this.todos, newTodo];
        this.updateStats();
        this.loadStats();
        this.notificationService.success('Tâche ajoutée avec succès');
      },
      error: (error: Error) => {
        console.error('Error creating todo:', error);
        this.notificationService.error('Erreur lors de l\'ajout de la tâche');
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
          this.loadStats();
          this.notificationService.success(
            updated.completed ? 'Tâche marquée comme terminée' : 'Tâche marquée comme non terminée'
          );
        }
      },
      error: (error: Error) => {
        console.error('Error updating todo:', error);
        this.notificationService.error('Erreur lors de la mise à jour de la tâche');
      }
    });
  }

  onDelete(todo: Todo) {
    const dialogRef = this.dialog.open(this.deleteDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.deleteTodo(todo.id).subscribe({
          next: () => {
            this.todos = this.todos.filter(t => t.id !== todo.id);
            this.updateStats();
            this.loadStats();
            this.notificationService.success('Tâche supprimée avec succès');
          },
          error: (error: Error) => {
            console.error('Error deleting todo:', error);
            this.notificationService.error('Erreur lors de la suppression de la tâche');
          }
        });
      }
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
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
}