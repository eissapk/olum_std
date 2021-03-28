import { html, css, $, OnInit, debug } from "../../lib/pk.js";
import { router } from "../app.js";
import { api } from "../services/api.js";
import Header from "../components/header.js";

let template = html`
  <div id="edit">
    <header />
    <form>
      <textarea></textarea>
      <button type="submit" class="saveBtn">save</button>
      <button to="/" type="button" class="cancelBtn">cancel</button>
    </form>
  </div>
`;

export default class Edit extends OnInit {
  data = {
    name: "edit",
    components: {
      Header,
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
    debug("test edit component");

    this.onMount();
    this.onSave();
  }

  onMount() {
    const input = $("#edit textarea");
    if (api.temp != null) input.value = api.temp.title;
    input.focus();
  }

  onSave() {
    const form = $("#edit form");
    form.on("submit", e => {
      e.preventDefault();
      const input = $("#edit textarea");
      api.edit(api.temp.id, input.value);
      router.navigate("/");
    });
  }
}

let style = css`
  #edit {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;

    form {
      width: 100%;
      overflow: hidden;
      margin: 10px auto;
      
      textarea {
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
    }
  }
`;
