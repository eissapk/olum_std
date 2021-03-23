import { html, css, $, OnInit, debug } from "../../lib/pk.js";
import { router } from "../app.js";
import { api } from "../services/api.js";

let template = html`
  <div id="todos">
    <ul></ul>
  </div>
`;

export default class Todos extends OnInit {
  data = {
    name: "Todos",
    template,
    style,
    render: () => this.render(),
    scoped: false,
  };

  constructor() {
    super();
  }

  init = () => super.init(this.data);

  render() {
    console.log("test from todos component");

    this.onChange();
    this.onDelete();
    this.onEdit();
  }

  onChange() {
    addEventListener(api.event, () => {
      const todos = api.get();
      const ul = $("#todos ul");
      if (ul) {
        ul.innerHTML = todos
          .map(todo => {
            return `
            <li>
              <p>${todo.title}</p>
              <span class="editBtn" data-id="${todo.id}">&#9998;</span>
              <span class="deleteBtn" data-id="${todo.id}">&#10006;</span>
            </li>
            `;
          })
          .join("");
      }
    });
    api.trigger(); // todo optimize service triggers
  }

  onDelete() {
    document.on("click", e => {
      if (e.target.classList.contains("deleteBtn")) {
        const id = +e.target.getAttribute("data-id");
        api.remove(id);
      }
    });
  }

  onEdit() {
    document.on("click", e => {
      if (e.target.classList.contains("editBtn")) {
        const id = e.target.getAttribute("data-id");
        const todo = api.get().find(item => item.id == id);
        api.temp = todo;
        router.navigate("/edit");
      }
    });
  }
}

let style = css`
  #todos ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  #todos ul li {
    overflow: hidden;
    background-color: #eee;
    margin-top: 5px;
  }
  #todos ul li p {
    margin: 0;
    width: calc(100% - 80px);
    line-height: 25px;
    float: left;
    word-break: break-word;
    padding: 0 10px;
  }
  #todos ul li span {
    width: 40px;
    height: 30px;
    line-height: 30px;
    font-size: 30px;
    text-align: center;
    color: white;
    cursor: pointer;
    float: left;
  }
  #todos ul li span.editBtn {
    background: #ffeb3b;
  }
  #todos ul li span.deleteBtn {
    background: #ff5722;
  }
`;
