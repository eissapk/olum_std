import { Service } from "olum-helpers";

class API extends Service {
  constructor() {
    super("ApiDataLoaded");
  }
  switch = true;

  add(todo) {
    const arr = this.get();
    arr.push(todo);
    localStorage.setItem("todos", JSON.stringify(arr));
    this.trigger();
  }

  delete(id) {
    const arr = this.get().filter(todo => todo.id != id);
    localStorage.setItem("todos", JSON.stringify(arr));
    this.trigger();
  }

  get() {
    let todos;
    if (localStorage.getItem("todos") !== null) {
      todos = JSON.parse(localStorage.getItem("todos"));
    } else {
      todos = [];
    }
    return todos;
  }
}

export const api = new API();
