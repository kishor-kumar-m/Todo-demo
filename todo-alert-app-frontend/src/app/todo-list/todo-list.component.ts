import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: any[] = [];
  page: number = 1;
  limit: number = 10;
  totalPages: number = 0;
  totalTodos: number = 0;
  searchTerm: string = '';
  completed: boolean | undefined; 

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getPaginatedTodos(this.page, this.limit, this.searchTerm, this.completed).subscribe(data => {
      this.todos = data.todos;
      this.totalPages = data.totalPages;
      this.totalTodos = data.totalTodos;
    });
  }

  goToNextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadTodos();
    }
  }

  goToPreviousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadTodos();
    }
  }

  onSearch(): void {
    this.page = 1; 
    this.loadTodos();
  }

  onFilterChange(completed: any): void {
    this.completed = completed.value === 'all' ? undefined : completed.value == 'true';
    this.page = 1;
    this.loadTodos();
  }
  markAsCompleted(todoId: string): void {
    this.todoService.updateTodoStatus(todoId, true).subscribe(updatedTodo => {
        this.loadTodos();
    });
}
}
