import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TodoHttpService {

  constructor(private httpClient: HttpClient) { }

  public GetAll(): Observable<Array<ToDoItem>> {
     return this.httpClient.get<Array<ToDoItem>>('https://localhost:5001/ToDoItem');
  }

  public Create(todoItem: ToDoItem): Observable<ToDoItem> {
    return this.httpClient.post<ToDoItem>('https://localhost:5001/ToDoItem', todoItem, httpOptions);
  }

  public Update(updateTodoItem: ToDoItem): Observable<ToDoItem> {
    return this.httpClient.put<ToDoItem>('https://localhost:5001/ToDoItem', updateTodoItem, httpOptions);
  }

  public FindById(id: number): Observable<ToDoItem>{
    return this.httpClient.get<ToDoItem>(`https://localhost:5001/ToDoItem/${id}`);
  }

  public Delete(id: number): Observable<ToDoItem> {
    return this.httpClient.delete<ToDoItem>(`https://localhost:5001/ToDoItem?id=${id}`);
  }
}
