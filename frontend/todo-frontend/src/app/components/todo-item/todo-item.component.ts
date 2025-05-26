import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { EditTodoDialogComponent } from '../edit-todo-dialog/edit-todo-dialog.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatRippleModule,
    MatTooltipModule
  ],
  template: `
    <mat-card [class.completed]="todo.completed" class="todo-card" matRipple>
      <div class="priority-indicator" [class]="'priority-' + todo.priority.toLowerCase()"></div>
      <mat-card-content>
        <div class="todo-content">
          <div class="todo-main">
            <mat-checkbox
              [checked]="todo.completed"
              (change)="onToggleComplete()"
              [disabled]="isUpdating"
              color="primary"
              class="todo-checkbox">
            </mat-checkbox>
            
            <div class="todo-info">
              <div class="todo-header">
                <h3 [class.completed-text]="todo.completed">{{ todo.title }}</h3>
                <div class="todo-actions">
                  <button mat-icon-button color="primary" (click)="onEdit(); $event.stopPropagation()" 
                          [disabled]="isUpdating"
                          class="action-button" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="onDelete(); $event.stopPropagation()" 
                          [disabled]="isUpdating"
                          class="action-button" matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <p *ngIf="todo.description" class="description">{{ todo.description }}</p>
              
              <div class="todo-meta">
                <mat-chip *ngIf="todo.due_date" [class.overdue]="isOverdue(todo.due_date)" 
                         [color]="isOverdue(todo.due_date) ? 'warn' : 'primary'" selected>
                  <mat-icon>event</mat-icon>
                  {{ todo.due_date | date:'shortDate' }}
                  <span *ngIf="isOverdue(todo.due_date)" class="overdue-text">En retard</span>
                </mat-chip>
              </div>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .todo-card {
      margin-bottom: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      position: relative;
    }

    .priority-indicator {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      transition: all 0.3s ease;
    }

    .priority-high {
      background-color: #e74c3c;
    }

    .priority-medium {
      background-color: #f39c12;
    }

    .priority-low {
      background-color: #3498db;
    }

    .todo-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    
    .completed {
      opacity: 0.7;
      background-color: #f8f9fa;
    }

    .completed .priority-indicator {
      opacity: 0.5;
    }
    
    .todo-content {
      padding: 16px;
    }

    .todo-main {
      display: flex;
      gap: 16px;
    }
    
    .todo-checkbox {
      margin-top: 4px;
    }
    
    .todo-info {
      flex: 1;
    }

    .todo-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    
    .todo-info h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
      color: #2c3e50;
      line-height: 1.4;
    }
    
    .completed-text {
      text-decoration: line-through;
      color: #95a5a6;
    }
    
    .description {
      color: #7f8c8d;
      margin: 8px 0;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    
    .todo-meta {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    
    .todo-actions {
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: all 0.2s ease;
    }

    .todo-card:hover .todo-actions {
      opacity: 1;
    }
    
    .action-button {
      transform: scale(0.9);
      transition: all 0.2s ease;
    }

    .action-button:hover {
      transform: scale(1);
      background-color: rgba(0, 0, 0, 0.04);
    }
    
    mat-chip {
      font-size: 12px;
      height: 24px;
      padding: 0 8px;
      transition: all 0.2s ease;
    }

    mat-chip:hover {
      transform: translateY(-1px);
    }

    .overdue {
      background-color: #e74c3c !important;
      color: white !important;
    }

    .overdue-text {
      margin-left: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .priority-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .priority-high {
      color: #e74c3c;
    }

    .priority-medium {
      color: #f39c12;
    }

    .priority-low {
      color: #3498db;
    }

    @media (max-width: 600px) {
      .todo-actions {
        opacity: 1;
      }

      .todo-card {
        margin-bottom: 12px;
      }

      .todo-info h3 {
        font-size: 1rem;
      }

      .description {
        font-size: 0.85rem;
      }

      .todo-content {
        padding: 12px;
      }

      .todo-meta {
        gap: 6px;
      }

      mat-chip {
        font-size: 11px;
        height: 22px;
      }
    }
  `]
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() todoDeleted = new EventEmitter<void>();
  @Output() todoUpdated = new EventEmitter<void>();

  isUpdating = false;

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog
  ) {}

  onToggleComplete(): void {
    if (this.isUpdating) return;
    this.isUpdating = true;

    const updatedTodo = { ...this.todo, completed: !this.todo.completed };
    this.todoService.updateTodo(this.todo.id!, { completed: !this.todo.completed })
      .subscribe({
        next: (response) => {
          Object.assign(this.todo, response);
          this.todoUpdated.emit();
          this.isUpdating = false;
        },
        error: (error) => {
          console.error('Error updating todo:', error);
          Object.assign(this.todo, updatedTodo);
          this.isUpdating = false;
        }
      });
  }

  onEdit(): void {
    const dialogRef = this.dialog.open(EditTodoDialogComponent, {
      width: '500px',
      data: { ...this.todo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const originalTodo = { ...this.todo };
        this.todoService.updateTodo(this.todo.id!, result)
          .subscribe({
            next: (response) => {
              Object.assign(this.todo, response);
              this.todoUpdated.emit();
            },
            error: (error) => {
              console.error('Error updating todo:', error);
              Object.assign(this.todo, originalTodo);
            }
          });
      }
    });
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: { title: this.todo.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.deleteTodo(this.todo.id!)
          .subscribe({
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

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'warn';
      case 'MEDIUM':
        return 'accent';
      case 'LOW':
        return 'primary';
      default:
        return 'primary';
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'Haute';
      case 'MEDIUM':
        return 'Moyenne';
      case 'LOW':
        return 'Basse';
      default:
        return priority;
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'priority-icon priority-high';
      case 'MEDIUM':
        return 'priority-icon priority-medium';
      case 'LOW':
        return 'priority-icon priority-low';
      default:
        return 'priority-icon';
    }
  }

  isOverdue(date: string | Date): boolean {
    if (!date) return false;
    const dueDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && !this.todo.completed;
  }
}