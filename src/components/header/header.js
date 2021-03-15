import { html, css, OnInit } from "../../../lib/spk.js";
import style from "./header.css";

let template = html`
  <header id="header">
    <ul>
      <li><a to="/">Home</a></li>
      <li><a to="/about">About</a></li>
    </ul>
  </header>
`;

export default class Header extends OnInit{
  data = {
    name: "Header",
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
    console.log("test from header component");
  }
}
