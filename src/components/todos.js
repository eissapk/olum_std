import { spk, html, css, $, debug } from "../../lib/spk.js";
import API from "../services/api.js";

let template = html`
  <div id="todos">
    <ul></ul>
  </div>
`;

export default class Todos {
  init(ob = spk.methods.nonScoped(template, style)) {
    eval(spk.data.init);
    return ob;
  }

  render(api = new API()) {
    const ul = $("#todos ul");

    const todos = api.get();

    ul.innerHTML = todos
      .map((todo) => {
        return html`
          <li>
            <p>${todo.title}</p>
            <span class="editBtn" data-id="${todo.id}">&#9998;</span>
            <span class="deleteBtn" data-id="${todo.id}">&#10006;</span>
          </li>
        `;
      })
      .join("");
      
  }
}

let style = css`
  #todos ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  #todos ul li {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    background-color: #eee;
    margin-top: 5px;
  }
  #todos ul li p {
    margin: 0;
    width: calc(100% - 80px);
    height: 30px;
    line-height: 30px;
    float: left;
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
