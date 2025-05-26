import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo, TodoCreate, Priority } from '../../models/todo.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="dialog-icon">add_task</mat-icon>
      Nouvelle tâche
    </h2>

    <mat-dialog-content>
      <form [formGroup]="todoForm" class="todo-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" placeholder="Entrez le titre de la tâche">
          <mat-error *ngIf="todoForm.get('title')?.hasError('required')">
            Le titre est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Entrez une description (optionnel)"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Priorité</mat-label>
            <mat-select formControlName="priority">
              <mat-option [value]="Priority.LOW">Basse</mat-option>
              <mat-option [value]="Priority.MEDIUM">Moyenne</mat-option>
              <mat-option [value]="Priority.HIGH">Haute</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date d'échéance</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="due_date">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="todoForm.invalid">
        <mat-icon>add</mat-icon>
        Ajouter
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
    }

    .dialog-icon {
      vertical-align: middle;
      margin-right: 8px;
    }

    mat-dialog-content {
      padding-top: 20px;
    }

    .todo-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    textarea {
      min-height: 100px;
    }

    mat-dialog-actions {
      padding: 16px 0;
      margin-bottom: 0;
    }

    mat-dialog-actions button {
      margin-left: 8px;
    }

    mat-dialog-actions button mat-icon {
      margin-right: 4px;
    }

    /* Input field styles */
    ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: transparent !important;
    }

    ::ng-deep .mat-mdc-form-field-flex {
      background-color: transparent !important;
    }

    ::ng-deep .mat-mdc-input-element {
      color: var(--text-color, #333333) !important;
      caret-color: var(--primary-color, #4a90e2) !important;
    }

    ::ng-deep .mat-mdc-form-field-label {
      color: var(--text-secondary, #666666) !important;
    }

    ::ng-deep .mat-mdc-select-value {
      color: var(--text-color, #333333) !important;
    }

    ::ng-deep .mat-mdc-select-arrow {
      color: var(--text-secondary, #666666) !important;
    }

    /* Dark theme styles */
    :host-context(.dark-theme) {
      ::ng-deep .mat-mdc-input-element {
        color: white !important;
        caret-color: var(--primary-color, #64b5f6) !important;
      }

      ::ng-deep .mat-mdc-form-field-label {
        color: rgba(255, 255, 255, 0.7) !important;
      }

      ::ng-deep .mat-mdc-select-value {
        color: white !important;
      }

      ::ng-deep .mat-mdc-select-arrow {
        color: rgba(255, 255, 255, 0.7) !important;
      }
    }
  `]
})
export class TodoFormComponent implements OnInit {
  @Input() todo?: Todo;
  @Input() isEditing = false;
  @Output() submit = new EventEmitter<TodoCreate>();
  @Output() cancel = new EventEmitter<void>();

  todoForm: FormGroup;
  Priority = Priority;

  constructor(
    private fb: FormBuilder,
    private dialogRef?: MatDialogRef<TodoFormComponent>
  ) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: [Priority.MEDIUM],
      due_date: [null]
    });
  }

  ngOnInit() {
    if (this.todo) {
      this.todoForm.patchValue({
        title: this.todo.title,
        description: this.todo.description,
        priority: this.todo.priority,
        due_date: this.todo.due_date ? new Date(this.todo.due_date) : null
      });
    }
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      const todoData: TodoCreate = {
        title: formValue.title.trim(),
        description: formValue.description?.trim() || '',
        priority: formValue.priority,
        due_date: formValue.due_date ? formValue.due_date.toISOString() : null,
        completed: false
      };

      if (this.dialogRef) {
        this.dialogRef.close(todoData);
      } else {
        this.submit.emit(todoData);
      }
    }
  }

  onCancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.cancel.emit();
    }
  }
}