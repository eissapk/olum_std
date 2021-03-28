import { html, css, OnInit, debug } from "../../lib/pk.js";
import Header from "../components/header.js";
import AddTodo from "../components/addtodo.js";
import Todos from "../components/todos.js";

let template = html`
  <div id="home">
    <header />
    <AddTodo />
    <Todos />
  </div>
`;

export default class Home extends OnInit {
  data = {
    name: "Home",
    components: {
      Header,
      AddTodo,
      Todos,
    },
    template,
    style,
    render: () => this.render(),
  };

  constructor() {
    super();
  }

  init = () => super.init(this.data);

  render() {
    debug("test home component");
  }
}

let style = css`
  #home {
    height: 100vh;
  }
`;
