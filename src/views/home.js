import {
  html,
  css,
  OnInit
} from "../../lib/spk.js";
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

export default class Home extends OnInit {
  data = {
    name: "Home",
    components: {
      Header,
      AddTodo,
      Todos,
      EditTodo,
    },
    template,
    style,
    render: () => this.render(),
    scoped: true,
  }

  constructor() {
    super();
  }

  init = () => super.init(this.data);

  render() {
    console.log("test from home component");
  }
}

let style = css`
  #home {
    height:100vh;
  }
`;