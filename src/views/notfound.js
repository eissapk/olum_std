import { html, css, OnInit } from "../../lib/spk.js";

let template = html`
  <div id="notfound">
    <h1>404</h1>
  </div>
`;

export default class NotFound extends OnInit {
  data = {
    name: "NotFound",
    components: {},
    template,
    style,
    render: () => this.render(),
    scoped: true,
  };

  constructor() {
    super();
  }

  init = () => super.init(this.data);

  render() {
    console.log("test from not found component");
  }
}

let style = css`
  #notfound h1 {
    text-align: center;
    color: royalblue;
    font-size: 60px;
  }
`;
