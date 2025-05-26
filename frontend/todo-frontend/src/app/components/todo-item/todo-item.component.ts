import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TodoService } from '../../services/todo.service';
import { Todo, Priority } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() todoDeleted = new EventEmitter<void>();
  @Output() todoUpdated = new EventEmitter<void>();

  editForm: FormGroup;
  priorities = Object.values(Priority);
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private dialog: MatDialog
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [null],
      priority: [Priority.MEDIUM],
      category: ['']
    });
  }

  ngOnChanges(): void {
    if (this.todo) {
      this.editForm.patchValue({
        title: this.todo.title,
        description: this.todo.description,
        dueDate: this.todo.due_date ? new Date(this.todo.due_date).toISOString().slice(0, 16) : null,
        priority: this.todo.priority,
        category: this.todo.category
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onSave(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      const updatedTodo = {
        ...formValue,
        due_date: formValue.dueDate ? new Date(formValue.dueDate).toISOString() : null
      };
      delete updatedTodo.dueDate;

      this.todoService.updateTodo(this.todo.id!, updatedTodo).subscribe({
        next: () => {
          this.isEditing = false;
          this.todoUpdated.emit();
        },
        error: (error) => {
          console.error('Error updating todo:', error);
        }
      });
    }
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '400px',
      data: { title: this.todo.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.deleteTodo(this.todo.id!).subscribe({
          next: () => {
            this.todoDeleted.emit();
          },
          error: (error) => {
            console.error('Error deleting todo:', error);
          }
        });
      }
    });
  }

  toggleComplete(): void {
    this.todoService.updateTodo(this.todo.id!, { completed: !this.todo.completed }).subscribe({
      next: () => {
        this.todoUpdated.emit();
      },
      error: (error) => {
        console.error('Error updating todo:', error);
      }
    });
  }
}

@Component({
  selector: 'delete-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirmer la suppression</h2>
    <mat-dialog-content>
      Êtes-vous sûr de vouloir supprimer la tâche "{{ data.title }}" ?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Supprimer</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class DeleteConfirmDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string }) {}
}