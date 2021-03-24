import { html, css, OnInit } from "../../lib/pk.js";

let template = html`
  <header id="header">
    <ul>
      <li><a to="/">Home</a></li>
      <li><a to="/about">About</a></li>
    </ul>
  </header>
`;

export default class Header extends OnInit {
  data = {
    name: "Header",
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
    console.log("test from header component");
  }
}

let style = css`
  header {
    height: 50px;
    line-height: 50px;
    background-color: #666;

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
      text-align: center;
      li {
        display: inline-block;
        color: white;
        margin: 0 10px;

        a {
          text-decoration: none;
          color: white;
          &.active {
            color: royalblue;
          }
        }
      }
    }
  }
`;
