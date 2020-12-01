import { Component, OnInit } from '@angular/core';
import { TodoService } from '../service/todo.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-todo-item',
  templateUrl: './update-todo-item.component.html',
  styleUrls: ['./update-todo-item.component.css']
})
export class UpdateTodoItemComponent implements OnInit {

  constructor(public todoItemService: TodoService,
    private router: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = this.router.snapshot.paramMap.get('id');
    this.todoItemService.SetSelectedTodoItemId(Number(id));
  }

  public updateTodoItem(): void {
    this.todoItemService.UpdateTodoItem(this.todoItemService.updatingToDoItem);
  }
}
