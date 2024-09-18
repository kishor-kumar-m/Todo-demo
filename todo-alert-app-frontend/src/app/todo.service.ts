import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private socket: Socket) {}

  // Get all todos
  getTodos(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getPaginatedTodos(page: number, limit: number, searchTerm?: string, completed?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    if (completed !== undefined) {
      params = params.set('completed', completed.toString());
    }

    return this.http.get(`${this.apiUrl}/todos`, { params });
  
  }

  // Create a new todo
  createTodo(todo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/todo`, todo);
  }
  createTodoWithImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/todo`, formData);
  }

  // Listen for todo alerts
  getTodoAlerts() {
    return this.socket.fromEvent('todoAlert');
  }

  // Listen for new todos being created
  onTodoCreated() {
    return this.socket.fromEvent('todoCreated');
  }

  updateTodoStatus(id: string, completed: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/todos/${id}`, { completed });
}
}
