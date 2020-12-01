import { TodoHttpService } from './todo-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { defer, of } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';
import { TodoStoreService } from './todo-store.service';
import { TodoService } from './todo.service';

describe('TodoService', () => {

  let service: TodoService;
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy, delete: jasmine.Spy };
  let todoStoreService: TodoStoreService;
  let todoHttpService: TodoHttpService;

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    todoStoreService = new TodoStoreService();
    todoHttpService = new TodoHttpService(<any>httpClientSpy);
    service = new TodoService(todoStoreService, todoHttpService);
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(TodoService);
  });

  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }
    function asyncError<T>(errorObject: any) {
      return defer(() => Promise.reject(errorObject));
    }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todoitems', () => {
    const expectAllTodoItems = todoStoreService.GetAll();
    httpClientSpy.get.and.returnValue(of(expectAllTodoItems)); // moq set up method return
    expect(service.todoItems.length).toBe(5);
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should process error response when get all items fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    // when
    service.todoItems;
    tick(10);  //set a time out to wait for the get all method

    // then
    expect(service.getAllFailMessage).toBe("get all fail because web api error");
  }));

  it('should create todo-item via mockhttp', () => {
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.post.and.returnValue(of(newTodoItem));
    service.Create(newTodoItem);
    // then
    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
  });

  it('should process error response when create item fail', fakeAsync(() => {
    // given
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.post.and.returnValue(asyncError(errorResponse));

    // when
    service.Create(newTodoItem);
    tick(10);  //set a time out to wait for the get all method

    // then
    expect(service.createFailMessage).toBe("create fail because web api error");
  }));

  it('should update todo-item via mockhttp', () => {
    const updateTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.put.and.returnValue(of(updateTodoItem));
    service.UpdateTodoItem(updateTodoItem);

    // then
    expect(httpClientSpy.put.calls.count()).toBe(1);
  });

  it('should process error response when update item fail', fakeAsync(() => {
    // given
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.put.and.returnValue(asyncError(errorResponse));

    // when
    service.UpdateTodoItem(newTodoItem);
    tick(10);  //set a time out to wait for the get all method

    // then
    expect(service.updateFailMessage).toBe("update fail because web api error");
  }));

  it('should delete todo item', () => {
    const id = 0;
    httpClientSpy.delete.and.returnValue(of('Delete ok'));
    service.DeleteTodoItem(id);
    // then
    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });

  it('should get special todo item', () => {
    const id = service.todoItems[4].id;
    service.SetSelectedTodoItemId(id);
    expect(service.selectedTodoItem.id).toBe(id);
  });
});
