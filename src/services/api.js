class Service {
  todos = [];

  constructor() {
    this.stateUpdated = new Event(`${new Date().getTime()}`);
    this.event = this.stateUpdated.type;
  }

  add(todo) {
    this.todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(this.todos));
    this.trigger();
  }

  remove(id) {
    this.todos = this.todos.filter((todo) => todo.id != id);
    localStorage.setItem("todos", JSON.stringify(this.todos));
    this.trigger();
  }

  edit(id, title) {
    this.todos = this.todos.forEach((todo) => {
      if (todo.id == id) {
        todo.title = title;
      }
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

  trigger() {
    dispatchEvent(this.stateUpdated);
  }

}

export const api = new Service();
