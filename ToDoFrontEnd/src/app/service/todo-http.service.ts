import { ToDoItem } from './../model/ToDoItem';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoHttpService {

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<Array<ToDoItem>> {
    return this.httpClient.get<Array<ToDoItem>>('https://localhost:5001/ToDoItem');
  }
}
