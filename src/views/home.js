import { spk, debug, html, css } from "../../lib/spk.js";
import Header from "../components/header.js";
import AddTodo from "../components/addtodo.js";
import Todos from "../components/todos.js";
import EditTodo from "../components/edittodo.js";

let template = html`
<div id="home">
    <Header />
    <AddTodo />
    <Todos />
    <EditTodo />
  </div>
`;

export default class Home {
  components = {
    Header,
    AddTodo,
    Todos,
    EditTodo
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
