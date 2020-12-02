import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { defer, of } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';
import { TodoHttpService } from './todo-http.service';
import { TodoStoreService } from './todo-store.service';
import { TodoService } from './todo.service';

describe('TodoService', () => {

  let service: TodoService;
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, delete: jasmine.Spy, put: jasmine.Spy };
  let todoStoreService: TodoStoreService;
  let todoHttpService: TodoHttpService;

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    todoStoreService = new TodoStoreService();
    todoHttpService = new TodoHttpService(<any>httpClientSpy);
    service = new TodoService(todoStoreService, todoHttpService);

    //TestBed.configureTestingModule({});
    //service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    const expected = todoStoreService.GetAll();
    httpClientSpy.get.and.returnValue(of(expected));
    expect(service).toBeTruthy();
  });

  it('should get all todo items', () => {
    const expected = todoStoreService.GetAll();
    httpClientSpy.get.and.returnValue(of(expected));
    expect(service.todoItems.length).toBe(5);
  });

  it('should process error response when get all todo items fail all todo items', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    // when
    service.todoItems;
    tick(50);

    // then
    expect(service.getAllErrorMessage).toBe('Get all fail Error');
  }));

  it('should create todo-item via mockHttp', () => {
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.post.and.returnValue(of(newTodoItem));
    service.Create(newTodoItem);

    // then
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('should process error response when create todo item fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.post.and.returnValue(asyncError(errorResponse));

    // when
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    service.Create(newTodoItem);
    tick(50);

    // then
    expect(service.createErrorMessage).toBe('Create fail Error');
  }));

  it('should update todo-item', () => {
    const updateTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.put.and.returnValue(of(updateTodoItem));

    // when 
    service.UpdateTodoItem(updateTodoItem);

    // then
    expect(httpClientSpy.put.calls.count()).toBe(1);
  });

  it('should process error response when update todo item fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.put.and.returnValue(asyncError(errorResponse));

    // when
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    service.UpdateTodoItem(newTodoItem);
    tick(50);

    // then
    expect(service.updateErrorMessage).toBe('Update fail Error');
  }));

  it('should delete todo item', () => {
    // given
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.delete.and.returnValue(of(newTodoItem));

    // when
    service.DeleteTodoItem(newTodoItem.id);

    // then
    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });

  it('should process error response when delete todo item fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.delete.and.returnValue(asyncError(errorResponse));

    // when
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    service.DeleteTodoItem(newTodoItem.id);
    tick(50);

    // then
    expect(service.deleteErrorMessage).toBe('Delete fail Error');
  }));

  it('should get special todo item', () => {
    // given
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.get.and.returnValue(of(newTodoItem));

    // when
    service.SetSelectedTodoItemId(newTodoItem.id);

    // then
    expect(service.selectedTodoItem.id).toBe(newTodoItem.id);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('should process error response when get special todo item fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    // when
    service.SetSelectedTodoItemId(6);
    tick(50);

    // then
    expect(service.getErrorMessage).toBe('Get fail Error');
  }));

  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }
  function asyncError<T>(errorObject: any) {
    return defer(() => Promise.reject(errorObject));
  }
});
