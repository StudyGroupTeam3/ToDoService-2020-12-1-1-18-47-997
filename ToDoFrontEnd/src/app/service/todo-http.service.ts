import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';

@Injectable({
  providedIn: 'root'
})
export class TodoHttpService {

  constructor(private httpClient: HttpClient) { }

  public GetAll(): Observable<Array<ToDoItem>> {
    return this.httpClient.get<Array<ToDoItem>>('http://localhost:5001/ToDoItem');
  }
}
