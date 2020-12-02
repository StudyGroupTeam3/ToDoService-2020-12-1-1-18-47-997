import { ToDoItem } from './../model/ToDoItem';
import { TodoHttpService } from './todo-http.service';
import { Injectable } from '@angular/core';
import { TodoStoreService } from './todo-store.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public updatingToDoItem: ToDoItem;
  public selectedTodoItem: ToDoItem;
  public getAllFailMessage = '';
  public error = '';
  public updateError = '';
  public deleteError = '';
  public getByIdError = '';

  private _todoItems: Array<ToDoItem>;

  constructor(private todoStore: TodoStoreService,
              private todoHttpService: TodoHttpService) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, "", "", false);
    this.selectedTodoItem = new ToDoItem(-1, "", "", false);
  }

  public get todoItems(): Array<ToDoItem> {
    const allTodoItem = new Array<ToDoItem>();
    this.todoHttpService.getAll().subscribe(todoItems => {
      allTodoItem.push(...todoItems);
    },
      error => {
        this.getAllFailMessage = 'get all fail because webapi error';
      });
    return allTodoItem;
  }

  public SetUpdatingTodoItemId(id: number): void {
    const foundTodoItem = this.todoStore.FindById(id);

    if (foundTodoItem !== undefined) {
      this.updatingToDoItem = Object.assign({}, foundTodoItem);
    }
  }

  public Create(todoItem: ToDoItem) {
    this.error = '';
    this.todoHttpService.create(todoItem).subscribe(item => {
      console.log(item);
    },
      error => {
        this.error = 'get error';
      }
    );
  }

  public UpdateTodoItem(updateTodoItems: ToDoItem): void {
    this.updateError = '';
    this.todoHttpService.update(updateTodoItems).subscribe(item => {
      console.log(item);
    }, error => {
      this.updateError = 'update error';
    });
  }

  public DeleteTodoItem(id: number): void {
    this.deleteError = '';
    this.todoHttpService.delete(id).subscribe(item => {
      console.log(item);
    }, error => {
      this.deleteError = 'delete error';
    });
  }

  public SetSelectedTodoItemId(id: number): void {
    this.getByIdError = '';
    this.todoHttpService.getById(id).subscribe(item => {
      console.log(item);
    }, error => {
      this.getByIdError = 'get by id error';
    });
  }
}
