import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { defer, of } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';
import { TodoHttpService } from './todo-http.service';
import { TodoStoreService } from './todo-store.service';
import { TodoService } from './todo.service';

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
    httpClientSpy.get.and.returnValue(of(expectAllTodoItems));
    expect(service.todoItems.length).toBe(5);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('should process error response when get all todoitems fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    // when
    service.todoItems;
    // then
    tick(0);// tick(0)也能过，但是必须tick()，保证消息队列中的操作机制
    expect(service.getAllFailMessage).toBe('Get all fails bucause webapi error');
  }));

  it('should create todo-item via mockhttp', () => {
    // given
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.post.and.returnValue(of(newTodoItem));
    service.Create(newTodoItem);
    // then
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('should process error response when create todo-item via mockhttp fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.post.and.returnValue(asyncError(errorResponse));
    service.Create(newTodoItem);
    // then
    tick(50);
    expect(service.getAllFailMessage).toBe('Create fails bucause webapi error');
  }));

  it('should update todo-item', () => {
    // given
    const updateTodoItem = new ToDoItem(10, "update todo", "update todo description", false);
    httpClientSpy.put.and.returnValue(of(updateTodoItem));
    service.UpdateTodoItem(updateTodoItem);
    // then
    expect(httpClientSpy.put.calls.count()).toBe(1);
  });

  it('should process error response when update todo-item fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    const updateTodoItem = new ToDoItem(10, "update todo", "update todo description", false);
    httpClientSpy.put.and.returnValue(asyncError(errorResponse));
    service.UpdateTodoItem(updateTodoItem);
    // then
    tick(50);
    expect(service.getAllFailMessage).toBe('Update fails bucause webapi error');
  }));

  it('should delete todo item', () => {
    const id = 0;
    httpClientSpy.delete.and.returnValue(of(id));
    service.DeleteTodoItem(id);
    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });

  it('should process error response when delete todo-item fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.delete.and.returnValue(asyncError(errorResponse));
    const id = 0;
    service.DeleteTodoItem(id);
    // then
    tick(50);
    expect(service.getAllFailMessage).toBe('Delete fails bucause webapi error');
  }));

  it('should get special todo item', () => {
    const expectedTodoItem = new ToDoItem(10, "update todo", "update todo description", false);
    httpClientSpy.get.and.returnValue(of(expectedTodoItem));
    service.SetSelectedTodoItemId(expectedTodoItem.id);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('should process error response when get special todo-item fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    const id = 0;
    service.SetSelectedTodoItemId(id);
    // then
    tick(50);
    expect(service.getAllFailMessage).toBe('GetById fails bucause webapi error');
  }));
});
