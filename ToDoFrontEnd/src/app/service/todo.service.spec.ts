import { fakeAsync } from '@angular/core/testing';
import { ToDoItem } from './../model/ToDoItem';
import { tick } from '@angular/core/testing';
import { defer, of, range } from 'rxjs';
import { TodoHttpService } from './todo-http.service';
import { TodoStoreService } from './todo-store.service';
import { TodoService } from './todo.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('TodoService', () => {

  let service: TodoService;
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy };
  let todoStoreService: TodoStoreService;
  let todoHttpService: TodoHttpService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    todoStoreService = new TodoStoreService();
    todoHttpService = new TodoHttpService(httpClientSpy as any);
    service = new TodoService(todoStoreService, todoHttpService);
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(TodoService);
  });

  // add part
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
    httpClientSpy.get.and.returnValue(of(expectAllTodoItems));
    expect(service.todoItems.length).toBe(5);
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should process error response when get all todoitems fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    // when
    // tslint:disable-next-line: no-unused-expression
    service.todoItems;
    tick(50);

    // then
    expect(service.getAllFailMessage).toBe('get all fail because webapi error');
  }));

  it('should create todo-item via mockhttp', () => {
    // given
    const newTodoItem = new ToDoItem(10, 'new todo', 'new todo description', false);
    httpClientSpy.post.and.returnValue(of(newTodoItem));

    // when
    service.Create(newTodoItem);

    // then
    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
  });

  it('should create error when create 5 times via mockhttp', fakeAsync(() => {
    // given
    const newTodoItem = new ToDoItem(10, 'new todo', 'new todo description', false);
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.post.and.returnValue(asyncError(errorResponse));

    // when
    service.Create(newTodoItem);
    tick(50);

    // then
    expect(service.error).toBe('get error');
  }));

  it('should update todo-item', () => {
    // given
    const updateTodoItem = new ToDoItem(10, 'new todo', 'new todo description', false);
    httpClientSpy.put.and.returnValue(of(updateTodoItem));

    // when
    service.UpdateTodoItem(updateTodoItem);

    // then
    expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
  });

  it('should delete todo item', () => {
    const id = service.todoItems[0].id;
    service.DeleteTodoItem(id);
    expect(service.todoItems.length).toBe(4);
  });

  it('should get special todo item', () => {
    const id = service.todoItems[4].id;
    service.SetSelectedTodoItemId(id);
    expect(service.selectedTodoItem.id).toBe(id);
  });
});
