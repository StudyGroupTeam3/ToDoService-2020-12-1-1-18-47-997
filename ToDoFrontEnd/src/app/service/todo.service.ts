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

  private _todoItems: Array<ToDoItem>;
  public getAllFailMessage: string;
  public createFailMessage: string;
  public updateFailMessage: string;
  public deleteFailMessage: string;
  public getByIdFailMessage: string;

  constructor(private todoStore: TodoStoreService,
    private todoHttpService: TodoHttpService) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, "", "", false);
    this.selectedTodoItem = new ToDoItem(-1, "", "", false);
    this.getAllFailMessage = '';
    this.createFailMessage = '';
    this.updateFailMessage = '';
    this.deleteFailMessage = '';
    this.getByIdFailMessage = '';
    //this.currentId = this.todoItems.length;
  }

  public get todoItems(): Array<ToDoItem> {
   const allTodoItems = new Array<ToDoItem>();
   this.todoHttpService.GetAll().subscribe(todoItems => {
     allTodoItems.push(...todoItems);
     this.getAllFailMessage = '';
    },
    error => this.getAllFailMessage = "get all fail because web api error");
    return allTodoItems;
  }

  public SetUpdatingTodoItemId(id: number): void {
    const foundTodoItem = this.todoStore.FindById(id);

    if (foundTodoItem !== undefined) {
      this.updatingToDoItem = Object.assign({}, foundTodoItem);
    }
  }

  public Create(todoItem: ToDoItem) {
    this.todoHttpService.Create(todoItem).subscribe(todoItem => {
      console.log(todoItem);
      this.createFailMessage = ''; },
    error => this.createFailMessage = "create fail because web api error");
  }

  public UpdateTodoItem(updateTodoItems: ToDoItem): void {
    this.todoHttpService.Update(updateTodoItems).subscribe(updateTodoItems => {
      console.log(updateTodoItems);
      this.updateFailMessage = ''; },
    error => this.updateFailMessage = "update fail because web api error");
  }

  public DeleteTodoItem(id: number):void{
    this.todoHttpService.Delete(id).subscribe((todoItem: any) => {
      console.log(todoItem);
      this.deleteFailMessage = ''; },
    error => this.deleteFailMessage = "delete fail because web api error");
  }

  public SetSelectedTodoItemId(id: number): void {
    this.todoHttpService.GetById(id).subscribe(todoItem => {
      this.getByIdFailMessage = '';
      this.selectedTodoItem = todoItem; },
    error => this.getByIdFailMessage = "getById fail because web api error");
  }
}
