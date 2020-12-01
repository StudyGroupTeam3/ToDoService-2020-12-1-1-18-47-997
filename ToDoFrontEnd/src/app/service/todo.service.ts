import { Injectable } from '@angular/core';
import { ToDoItem } from '../model/ToDoItem';
import { TodoHttpService } from './todo-http.service';
import { TodoStoreService } from './todo-store.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public updatingToDoItem: ToDoItem;
  public selectedTodoItem: ToDoItem;
  private currentId: number = 0;
  public getAllFailMessage: string;

  private _todoItems: Array<ToDoItem>;

  constructor(private todoStore: TodoStoreService, private todoHttpService: TodoHttpService) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, "", "", false);
    this.selectedTodoItem = new ToDoItem(-1, "", "", false);
    // this.currentId = this.todoItems.length;
    this.getAllFailMessage = '';
  }

  public get todoItems(): Array<ToDoItem> {
    const allToDoItem = new Array<ToDoItem>();
    this.todoHttpService.GetAll().subscribe(
      todoItems => {
        allToDoItem.push(...todoItems);
        this.getAllFailMessage = '';
      },
      error => {
        this.getAllFailMessage = 'Get all fails bucause webapi error';
      }
    );
    return allToDoItem;
  }// get 可以暴露双向绑定

  public SetUpdatingTodoItemId(id: number): void {
    this.todoHttpService.GetById(id).subscribe(todoItem => {
      Object.assign(this.updatingToDoItem, todoItem);
    });
  }

  public Create(todoItem: ToDoItem) {
    this.todoHttpService.Create(todoItem).subscribe(
      todoItem => {
        this.getAllFailMessage = '';
      },
      error => {
        this.getAllFailMessage = 'Create fails bucause webapi error';
      }
    );
  }

  public UpdateTodoItem(updateTodoItem: ToDoItem): void {
    this.todoHttpService.Update(updateTodoItem).subscribe(
      todoItem => {
        this.getAllFailMessage = '';
      },
      error => {
        this.getAllFailMessage = 'Update fails bucause webapi error';
      }
    );
  }

  public DeleteTodoItem(id: number): void {
    this.todoHttpService.Delete(id).subscribe(
      (todoItem: any) => {
        this.getAllFailMessage = '';
      },
      error => {
        this.getAllFailMessage = 'Delete fails bucause webapi error';
      }
    );
  }

  public SetSelectedTodoItemId(id: number): void {
    this.todoHttpService.GetById(id).subscribe(
      todoItem => {
        this.selectedTodoItem = todoItem;
        this.getAllFailMessage = '';
      },
      error => {
        this.getAllFailMessage = 'GetById fails bucause webapi error';
      }
    );
  }
}
