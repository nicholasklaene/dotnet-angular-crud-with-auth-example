import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITodo } from '../interfaces';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  @Input() todo!: ITodo;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  editable: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  async toggleEditable() {
    if (this.editable) {
      await this.updateTodo();
    }
    this.editable = !this.editable;
  }

  async updateTodo(): Promise<void> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const updateURL = `https://localhost:44307/api/todos/${userId}/${this.todo.todoId}`;
    const request = await fetch(updateURL, {
      method: 'PUT',
      body: JSON.stringify(this.todo),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (request.status != 204) {
      console.log('Error');
    }
  }

  async changeCompletion(): Promise<void> {
    this.todo.complete = !this.todo.complete;
    await this.updateTodo();
  }

  async deleteTodo(): Promise<void> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const updateURL = `https://localhost:44307/api/todos/${userId}/${this.todo.todoId}`;
    const request = await fetch(updateURL, {
      method: 'DELETE',
      body: JSON.stringify(this.todo),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (request.status != 204) {
      console.log('Error');
    } else {
      this.notifyParent.emit(this.todo);
    }
  }
}
