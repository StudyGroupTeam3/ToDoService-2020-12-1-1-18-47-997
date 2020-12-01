import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoitemDetailComponent } from './todoitem-detail/todoitem-detail.component';
import { ListTodoitemComponent } from './list-todoitem/list-todoitem.component';
import { CreateTodoitemComponent } from './create-todoitem/create-todoitem.component';
import { UpdateTodoItemComponent } from './update-todo-item/update-todo-item.component';


export const routes: Routes = [
  { path: "", component: ListTodoitemComponent },
  { path: "create/:id", component: CreateTodoitemComponent },
  { path: "edit/:id", component: UpdateTodoItemComponent },
  { path: "detail/:id", component: TodoitemDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
