import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Todo } from '../todo';

@Component({
  selector: 'app-todo-list-header',
  templateUrl: './todo-list-header.component.html',
  styleUrls: ['./todo-list-header.component.scss']
})
export class TodoListHeaderComponent {

  newTodo: Todo = new Todo();
  totalTime: number
  
  @Input()
  set todos(todos: Todo[]) {
    this.totalTime = todos.map(todo => (todo.timeSpent ? todo.timeSpent : 0)).reduce((acc, val) => acc + val, 0)
    console.log(this.totalTime)
  }

  @Output()
  add: EventEmitter<Todo> = new EventEmitter();

  constructor() {
  }

  addTodo() {
    this.add.emit(this.newTodo);
    this.newTodo = new Todo();
  }

}
