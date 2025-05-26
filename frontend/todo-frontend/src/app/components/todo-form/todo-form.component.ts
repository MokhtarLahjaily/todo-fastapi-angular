import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Todo, Priority } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent {
  @Output() create = new EventEmitter<Todo>();

  todoForm: FormGroup;
  priorities = Object.values(Priority);

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dueDate: [null],
      priority: [Priority.MEDIUM],
      category: ['']
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      const todo: Todo = {
        title: formValue.title,
        description: formValue.description,
        completed: false,
        due_date: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
        priority: formValue.priority,
        category: formValue.category
      };

      this.create.emit(todo);
      this.todoForm.reset({
        priority: Priority.MEDIUM
      });
    }
  }
}