import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ITodo } from '../interfaces/index';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  todos: ITodo[] = [];
  showModal: boolean = false;

  newTodoForm = this.formBuilder.group({
    description: '',
    complete: false,
    userId: localStorage.getItem('userId'),
  });

  constructor(private formBuilder: FormBuilder) {}

  async ngOnInit(): Promise<void> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const todosUrl = `https://localhost:44307/api/todos/${userId}`;
    try {
      let request = await fetch(todosUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.todos = await request.json();
      let status = request.status;
      if (status != 200) {
        // JWT most likely expired. Haven't implemented refresh token so just forcing reauth
        this.clearStorageAndLogout();
      }
    } catch (error) {
      this.clearStorageAndLogout();
    }
  }

  clearStorageAndLogout() {
    console.log('Error fetching todos');
    localStorage.clear();
    window.location.href = '/login';
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  removeTodo(todo: ITodo): void {
    this.todos = this.todos.filter((t) => t.todoId != todo.todoId);
  }

  async createTodo() {
    if (this.newTodoForm.status == 'INVALID') {
      console.log('invalid');
      return;
    }
    console.log(this.newTodoForm.value);
    const createURL = `https://localhost:44307/api/todos`;
    const token = localStorage.getItem('token');
    let res = await fetch(createURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(this.newTodoForm.value),
    });
    if (res.status == 201) {
      let newTodo = await res.json();
      this.todos.push(newTodo);
    }
    this.showModal = false;
  }
}
