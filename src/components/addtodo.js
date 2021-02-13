import { spk, html, css, $, debug } from "../../lib/spk.js";
import {api} from "../services/api.js";

let template = html`
  <div id="addtodo">
    <form>
      <input type="text" placeholder="Enter Todo..." />
      <button type="submit">add</button>
    </form>
  </div>
`;

export default class AddTodo {
  init(ob = spk.methods.scoped(template, style)) {
    eval(spk.data.init);
    return ob;
  }

  render() {
    const form = $("#addtodo form");
    const input = $("#addtodo input");

    form.on("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (value != "") {
        const todo = { title: value, id: new Date().getTime() };
        api.add(todo);
        form.reset();
      }
    });
  }
}

let style = css`
  #addtodo {
    height: 40px;
  }
  #addtodo form input {
    height: 40px;
    width: calc(100% - 40px);
    float: left;
    border: 1px solid royalblue;
    padding: 0 10px;
    box-sizing: border-box;
    outline: none;
  }
  #addtodo form button {
    height: 40px;
    width: 40px;
    background: royalblue;
    color: white;
    float: left;
    border: none;
    padding: 0;
    box-sizing: border-box;
    outline: none;
    cursor: pointer;
  }
`;
