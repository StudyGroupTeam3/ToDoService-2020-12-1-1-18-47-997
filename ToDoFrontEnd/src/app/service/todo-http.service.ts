import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';


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

  public GetAll(): Observable<Array<ToDoItem>>{
    return this.httpClient.get<Array<ToDoItem>>('https://localhost:5001/ToDoItem');
  }

  public Create(todoItem: ToDoItem): Observable<ToDoItem>{
    return this.httpClient.post<ToDoItem>('https://localhost:5001/ToDoItem',
    todoItem, httpOptions);
  }

  public Update(updateTodoItem: ToDoItem): Observable<ToDoItem>{
    return this.httpClient.put<ToDoItem>('https://localhost:5001/ToDoItem',
    updateTodoItem, httpOptions);
  }

  public Delete(id: number): Observable<any>{
    return this.httpClient.delete<ToDoItem>(`https://localhost:5001/ToDoItem?id=${id}`, httpOptions);
  }
}
