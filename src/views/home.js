import { spk, debug, html, css } from "../../lib/spk.js";
import Header from "../components/header.js";
import AddTodo from "../components/addtodo.js";
import Todos from "../components/todos.js";

let template = html`
  <Header />
  <div id="home">
    <AddTodo />
    <Todos />
  </div>
`;

export default class Home {
  components = {
    Header,
    AddTodo,
    Todos
  };

  init(ob = spk.methods.scoped(template, style)) {
    eval(spk.data.init);
    return ob;
  }

  render() {}
}

let style = css`
  #home {
  }
`;
