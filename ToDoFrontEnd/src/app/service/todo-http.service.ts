import { ToDoItem } from './../model/ToDoItem';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public getAll(): Observable<Array<ToDoItem>> {
    return this.httpClient.get<Array<ToDoItem>>('https://localhost:5001/ToDoItem');
  }

  public create(todoItem: ToDoItem): Observable<ToDoItem> {
    return this.httpClient.post<ToDoItem>('https://localhost:5001/ToDoItem', todoItem, httpOptions);
  }

  public update(todoItem: ToDoItem): Observable<ToDoItem> {
    return this.httpClient.put<ToDoItem>(`https://localhost:5001/ToDoItem`, todoItem, httpOptions);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`https://localhost:5001/ToDoItem?id=${id}`, httpOptions);
  }

  public getById(id: number): Observable<ToDoItem> {
    return this.httpClient.get<ToDoItem>(`https://localhost:5001/ToDoItem/${id}`);
  }
}
