import { Service } from "../../lib/pk.js";
class API extends Service {
  todos = [];
  temp = null;

  constructor() {
    super("api_1");
  }

  add(todo) {
    this.todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(this.todos));
    this.trigger();
  }

  remove(id) {
    this.todos = this.todos.filter(todo => todo.id != id);
    localStorage.setItem("todos", JSON.stringify(this.todos));
    this.trigger();
  }

  edit(id, title) {
    this.todos = this.todos.filter(todo => {
      if (todo.id == id) todo.title = title;
      return todo;
    });
    localStorage.setItem("todos", JSON.stringify(this.todos));
    this.trigger();
  }

  get() {
    if (localStorage.getItem("todos") !== null) {
      this.todos = JSON.parse(localStorage.getItem("todos"));
    } else {
      this.todos = [];
    }

    return this.todos;
  }
}

export const api = new API();