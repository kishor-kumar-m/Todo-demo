import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent {
  todoForm: FormGroup;
  selectedFile: File | null = null;


  constructor(private fb: FormBuilder, private todoService: TodoService) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      imageUrl: ['']
    });
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const formData = new FormData();

      formData.append('title', this.todoForm.get('title')?.value);
      formData.append('description', this.todoForm.get('description')?.value);
      formData.append('dueDate', this.todoForm.get('dueDate')?.value);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.todoService.createTodoWithImage(formData).subscribe(response => {
        console.log('Todo created:', response);
        this.todoForm.reset(); // Reset the form after successful submission
      });
    }
  }
}
