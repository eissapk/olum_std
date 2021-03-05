import { html, css, $, OnInit } from "../../lib/spk.js";
import { api } from "../services/api.js";

let template = html`
  <div id="todos">
    <ul></ul>
  </div>
`;

export default class Todos extends OnInit{
  data = {
    template,
    style,
    render: () => this.render(),
    scoped: false,
  }

  constructor() {
    super();
  }

  init = () => super.init(this.data);

  render() {
    setTimeout(() => api.trigger(), 0); // dispatchEvent

    this.onChange();
    this.onDelete();
    this.onEdit();
  }

  onChange() {
    addEventListener(api.event, () => {
      // todo make on() as addEventListener
      const todos = api.get();
      const ul = $("#todos ul");
      ul.innerHTML = todos
        .map((todo) => {
          return `
            <li>
              <p>${todo.title}</p>
              <span class="editBtn" data-id="${todo.id}">&#9998;</span>
              <span class="deleteBtn" data-id="${todo.id}">&#10006;</span>
            </li>
          `;
        })
        .join("");
    });
  }

  onDelete() {
    document.on("click", (e) => {
      if (e.target.classList.contains("deleteBtn")) {
        const id = +e.target.getAttribute("data-id");
        api.remove(id);
      }
    });
  }

  onEdit() {
    document.on("click", (e) => {
      if (e.target.classList.contains("editBtn")) {
        const id = e.target.getAttribute("data-id");
        const todo = api.get().find((item) => item.id == id);

        const edittodo = $("#edittodo");
        const input = $("#edittodo textarea");
        api.id = id;
        input.value = todo.title;
        edittodo.style.display = "block";
        input.focus();
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
    word-break:break-word;
    padding:0 10px;
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
