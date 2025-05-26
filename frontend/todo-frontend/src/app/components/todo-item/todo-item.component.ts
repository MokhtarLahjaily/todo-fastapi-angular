import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ]
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() todoUpdated = new EventEmitter<void>();
  
  isEditing = false;
  editTitle = '';
  editDescription = '';
  isUpdating = false;

  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {}

  startEdit(): void {
    this.isEditing = true;
    this.editTitle = this.todo.title;
    this.editDescription = this.todo.description || '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editTitle = '';
    this.editDescription = '';
  }

  saveEdit(): void {
    if (this.editTitle.trim() && !this.isUpdating) {
      this.isUpdating = true;
      
      this.todoService.updateTodo(this.todo.id, {
        title: this.editTitle.trim(),
        description: this.editDescription.trim() || undefined
      }).subscribe({
        next: () => {
          this.isEditing = false;
          this.isUpdating = false;
          this.snackBar.open('Tâche mise à jour!', 'Fermer', { duration: 2000 });
        },
        error: (error: Error) => {
          console.error('Erreur mise à jour:', error);
          this.isUpdating = false;
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  toggleCompleted(): void {
    this.todoService.toggleTodo(this.todo.id, !this.todo.completed).subscribe({
      next: () => {
        this.snackBar.open(
          this.todo.completed ? 'Tâche marquée comme incomplète' : 'Tâche complétée!',
          'Fermer',
          { duration: 2000 }
        );
      },
      error: (error: Error) => {
        console.error('Erreur toggle:', error);
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteTodo(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.todoService.deleteTodo(this.todo.id).subscribe({
        next: () => {
          this.snackBar.open('Tâche supprimée!', 'Fermer', { duration: 2000 });
        },
        error: (error: Error) => {
          console.error('Erreur suppression:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}