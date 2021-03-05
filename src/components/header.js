import { html, css, OnInit } from "../../lib/spk.js";

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
    template,
    style,
    render: () => this.render(),
    scoped: true,
  }

  constructor() {
    super();
  }

  init = () => super.init(this.data);

  render() {}
}

let style = css`
  header {
    height: 50px;
    line-height: 50px;
    background-color: #666;
  }
  header ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: center;
  }
  header ul li {
    display: inline-block;
    color: white;
    margin: 0 10px;
  }
  header ul li a {
    text-decoration: none;
    color: white;
  }
  header ul li a.active {
    color: royalblue;
  }
`;
