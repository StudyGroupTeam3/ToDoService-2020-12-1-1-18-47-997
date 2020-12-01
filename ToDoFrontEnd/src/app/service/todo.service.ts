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
  public getAllFailMessage: string;
  public error: string;
  public updateError: string;
  private currentId: number = 0;

  private _todoItems: Array<ToDoItem>;

  constructor(private todoStore: TodoStoreService,
              private todoHttpService: TodoHttpService) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, "", "", false);
    this.selectedTodoItem = new ToDoItem(-1, "", "", false);
    this.getAllFailMessage = '';
    this.error = '';
    this.updateError = '';
    // this.currentId = this.todoItems.length;
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
    // todoItem.id = this.currentId;
    // // tslint:disable-next-line: prefer-const
    // let newTodoItem = Object.assign({}, todoItem);
    // this.todoStore.Create(newTodoItem);
    // this.currentId++;
    this.error = '';
    this.todoHttpService.create(todoItem).subscribe(todoItem =>
      {
        console.log(todoItem);
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
    // this.todoStore.Update(updateTodoItems);
  }

  public DeleteTodoItem(id: number): void {
    this.todoStore.Delete(id);
  }

  public SetSelectedTodoItemId(id: number): void {
    this.selectedTodoItem = this.todoStore.FindById(id);
  }
}
