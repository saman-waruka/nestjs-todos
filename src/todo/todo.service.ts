import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './todo.interface';

const FILE_PATH = path.resolve(__dirname, 'todos.json');

@Injectable()
export class TodoService {
  private todos: Todo[] = [];

  constructor() {
    console.log('FILE_PATH ', FILE_PATH);
    this.loadTodosFromFile();
  }

  private loadTodosFromFile() {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, 'utf-8');
      this.todos = JSON.parse(data);
    }
  }

  private saveTodosToFile() {
    fs.writeFileSync(FILE_PATH, JSON.stringify(this.todos, null, 2));
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: string): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundException();
    }
    return todo;
  }

  create(todo: Omit<Todo, 'id'>) {
    const newTodo: Todo = {
      ...todo,
      id: uuidv4(),
    };
    this.todos.push(newTodo);
    this.saveTodosToFile();
    return newTodo;
  }

  update(id: string, updatedTodo: Partial<Todo>) {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException();
    }
    this.todos[todoIndex] = { ...this.todos[todoIndex], ...updatedTodo };
    this.saveTodosToFile();
    return this.todos[todoIndex];
  }

  remove(id: string): { success: boolean } {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException();
    }
    this.todos.splice(todoIndex, 1);
    this.saveTodosToFile();
    return { success: true };
  }
}
