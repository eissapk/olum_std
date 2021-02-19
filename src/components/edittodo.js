import { spk, html, css, $, debug } from "../../lib/spk.js";
import { api } from "../services/api.js";
import Header from "./header.js";

let template = html`
  <div id="edittodo">
    <header />
    <form>
      <textarea></textarea>
      <button type="submit" class="saveBtn">save</button>
      <button type="button" class="cancelBtn">cancel</button>
    </form>
  </div>
`;

export default class EditTodo {
  components = {
    Header,
  };

  init(ob = spk.methods.scoped(template, style)) {
    eval(spk.data.init);
    return ob;
  }

  render() {
    this.onSave();
    this.onCancel();
  }

  onCancel() {
    document.on("click", (e) => {
      if (e.target.classList.contains("cancelBtn")) {
        const edittodo = $("#edittodo");
        edittodo.style.display = "none";
      }
    });
  }

  onSave() {
    const form = $("#edittodo form");

    form.on("submit", (e) => {
      e.preventDefault();
      const input = $("#edittodo textarea");
      const edittodo = $("#edittodo");

      api.edit(api.id, input.value);
      edittodo.style.display = "none";
    });
  }
}

let style = css`
  #edittodo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    display: none;
  }

  #edittodo form {
    width: 100%;
    overflow: hidden;
    margin: 10px auto;
  }

  #edittodo form textarea {
    width: 100%;
    min-height: 80px;
    resize: vertical;
    outline: none;
  }

  .saveBtn {
    float: right;
  }

  .cancelBtn {
    float: left;
  }
`;
