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
  public getAllErrorMessage: string = '';
  public createErrorMessage: string = '';
  public getErrorMessage: string = '';
  public deleteErrorMessage: string = '';
  public updateErrorMessage: string = '';
  private currentId: number = 0;

  private _todoItems: Array<ToDoItem>;

  constructor(private todoStore: TodoStoreService, private httpService: TodoHttpService) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, "", "", false);
    this.selectedTodoItem = new ToDoItem(-1, "", "", false);
    //this.currentId = this.todoItems.length;
  }

  public get todoItems(): Array<ToDoItem> {
    const allTodoItems = new Array<ToDoItem>();
    this.httpService.GetAll().subscribe((todoItem)=> {
      allTodoItems.push(...todoItem);
    }, error => this.getAllErrorMessage = "Get all fail Error")
    return allTodoItems;
  }

  public SetUpdatingTodoItemId(id: number): void {
    const foundTodoItem = this.todoStore.FindById(id);
    
    if (foundTodoItem !== undefined) {
      this.updatingToDoItem = Object.assign({}, foundTodoItem);
    }
  }

  public Create(todoItem: ToDoItem) {
    this.createErrorMessage = '';
    this.httpService.Create(todoItem).subscribe(()=> { }, 
    error => this.createErrorMessage = "Create fail Error");
  }

  public UpdateTodoItem(updateTodoItems: ToDoItem): void {
    this.updateErrorMessage = '';
    this.httpService.Update(updateTodoItems).subscribe(()=> { }, 
    error => this.updateErrorMessage = "Update fail Error");
  }

  public DeleteTodoItem(id: number):void{   
    this.httpService.Delete(id).subscribe(()=> { }, 
    error => this.deleteErrorMessage = "Delete fail Error");
  }

  public SetSelectedTodoItemId(id: number):void{
    this.httpService.Get(id).subscribe((todoItem)=> {
      this.selectedTodoItem = todoItem;
     }, error => this.getErrorMessage = "Get fail Error");
  }
}
