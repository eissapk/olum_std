import { html, css, OnInit, debug } from "../../lib/pk.js";

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
  };

  constructor() {
    super();
  }

  init = () => super.init(this.data);

  render() {
    debug("test not found component");
  }
}

let style = css`
  #notfound {
    h1 {
      text-align: center;
      color: royalblue;
      font-size: 60px;
    }
  }
`;
