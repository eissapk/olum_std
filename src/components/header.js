import { html, css, OnInit, $, debug } from "../../lib/pk.js";
import logo from "../assets/logo.svg";

let template = html`
  <header id="header">
    <a to="/"><img src=${logo} /></a>
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

    a {
      width: 50px;
      height: 50px;
      float: left;
      img {
        pointer-events: none;
        width: 100%;
      }
    }
    ul {
      width: calc(100% - 50px);
      height: 50px;
      float: left;
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
