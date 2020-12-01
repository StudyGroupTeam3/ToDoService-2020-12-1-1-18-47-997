import { TodoHttpService } from './todo-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { defer, of } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';
import { TodoStoreService } from './todo-store.service';
import { TodoService } from './todo.service';

describe('TodoService', () => {

  let service: TodoService;
  // 定义Spy client
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy, delete: jasmine.Spy };
  let todoStoreService: TodoStoreService;
  let todoHttpService: TodoHttpService;

  beforeEach(() => {
    // TODO: spy on other methods too
    // httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    todoStoreService = new TodoStoreService();
    todoHttpService = new TodoHttpService(httpClientSpy as any);

    // const expectAllTodoItems = todoStoreService.GetAll();
    // httpClientSpy.get.and.returnValue(of(expectAllTodoItems)); // 给httpClient加行为，在get的时候返回returnValue

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

  // 断言是否在后端调用了http get方法
  it('should get all todoitems', () => {
    const expectAllTodoItems = todoStoreService.GetAll();
    httpClientSpy.get.and.returnValue(of(expectAllTodoItems)); // 给httpClient加行为，在get的时候返回returnValue
    expect(service.todoItems.length).toBe(5);
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call'); // 调用一次
  });

  it('should process error response ', fakeAsync(() => {
    // given 定义spy的行为
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    // when
    service.todoItems;
    tick(50); // todoItems 调用 Get 方法返回数据， 需要等待一段时间，数据全部传过来，所以要用tick
    // then
    expect(service.getAllFailMessage).toBe('Get all fail because web api error');
  }));


  it('should create todo-item via mockhttp', fakeAsync(() => {
   // given
   const todoItem = new ToDoItem(1, 'name', 'name', false);
   // when
   httpClientSpy.post.and.returnValue(of(todoItem));
   service.Create(todoItem);
   tick(50);
   // then
   expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
  }));

  it('should process error response when create fail', fakeAsync(() => {
    const todoItem = new ToDoItem(1, 'name', 'name', false);
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.post.and.returnValue(asyncError(errorResponse));
    // when
    service.Create(todoItem);
    tick(50);
    // then
    expect(service.createFailMessage).toBe('Create fail because web api error');
  }));

  it('should update todo-item', fakeAsync(() => {
    // given
    const updateTodoItem = new ToDoItem(1, 'name', 'name', true);
    // when
    httpClientSpy.put.and.returnValue(of(updateTodoItem));
    service.UpdateTodoItem(updateTodoItem);
    tick(50);
    // then
    expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
   }));

  it('should process error response when update fail', fakeAsync(() => {
    const updateTodoItem = new ToDoItem(1, 'name', 'name', true);
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.put.and.returnValue(asyncError(errorResponse));
    // when
    service.UpdateTodoItem(updateTodoItem);
    tick(50);
    // then
    expect(service.updateFailMessage).toBe('Update fail because web api error');
  }));

  it('should get special todo item', fakeAsync(() => {
    // given
    const todoItem = new ToDoItem(1, 'name', 'name', true);
    httpClientSpy.get.and.returnValue(of(todoItem));
    // when
    service.SetSelectedTodoItemId(todoItem.id);
    tick(50);
    // then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  }));

  it('should process error response when get by id fail', fakeAsync(() => {
    const todoItem = new ToDoItem(1, 'name', 'name', true);
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    // when
    service.SetSelectedTodoItemId(todoItem.id);
    tick(50);
    // then
    expect(service.getByIdFailMessage).toBe('Get By Id fail because web api error');
  }));

  it('should delete todo item', fakeAsync(() => {
    // given
    const todoItem = new ToDoItem(1, 'name', 'name', true);
    httpClientSpy.delete.and.returnValue(of(todoItem));
    // when
    service.DeleteTodoItem(todoItem.id);
    tick(50);
    // then
    expect(httpClientSpy.delete.calls.count()).toBe(1, 'one call');
  }));

  it('should process error response when delete fail', fakeAsync(() => {
    const todoItem = new ToDoItem(1, 'name', 'name', true);
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.delete.and.returnValue(asyncError(errorResponse));
    // when
    service.DeleteTodoItem(todoItem.id);
    tick(50);
    // then
    expect(service.deleteFailMessage).toBe('Delete fail because web api error');
  }));
});
