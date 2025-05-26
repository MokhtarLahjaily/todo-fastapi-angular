import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Todo, Priority } from '../../models/todo.model';

@Component({
  selector: 'app-edit-todo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Modifier la tâche</h2>
    <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" required>
          <mat-error *ngIf="editForm.get('title')?.hasError('required')">
            Le titre est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date d'échéance</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dueDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Priorité</mat-label>
          <mat-select formControlName="priority">
            <mat-option *ngFor="let priority of priorities" [value]="priority">
              {{ getPriorityLabel(priority) }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" [mat-dialog-close]="false">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!editForm.valid">
          Enregistrer
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
      padding: 20px 0;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-actions {
      padding: 8px 0;
    }
  `]
})
export class EditTodoDialogComponent {
  editForm: FormGroup;
  priorities = Object.values(Priority);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditTodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Todo
  ) {
    this.editForm = this.fb.group({
      title: [data.title, Validators.required],
      description: [data.description],
      dueDate: [data.due_date ? new Date(data.due_date) : null],
      priority: [data.priority]
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      const updatedTodo = {
        ...formValue,
        due_date: formValue.dueDate ? formValue.dueDate.toISOString() : null
      };
      delete updatedTodo.dueDate;
      this.dialogRef.close(updatedTodo);
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
} 