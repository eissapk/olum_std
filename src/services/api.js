let todos = [];

export default class API {

  add(todo) {
    todos.push(todo);
  }

  remove(id) {
    todos = todos.filter((todo) => todo.id != id);
  }
  
  edit(id, title) {
    todos = todos.forEach((todo) => {
      if (todo.id == id) {
        todo.title = title;
      }
    });
  }

  get() {
    return todos;
  }
}
