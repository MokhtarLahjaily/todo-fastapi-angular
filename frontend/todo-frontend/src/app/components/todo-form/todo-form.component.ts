import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TodoCreate } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TodoFormComponent {
  @ViewChild('todoForm') todoForm!: NgForm;
  @Output() addTodo = new EventEmitter<TodoCreate>();
  todo: TodoCreate = { title: '', completed: false, description: '' };
  isSubmitting = false;

  onSubmit() {
    if (this.todo.title.trim()) {
      this.isSubmitting = true;
      this.addTodo.emit({ ...this.todo });
      setTimeout(() => {
        this.todo = { title: '', completed: false, description: '' };
        this.todoForm.resetForm();
        this.isSubmitting = false;
      }, 100);
    }
  }
}