import { spk, html, css } from "../../lib/spk.js";

let template = html`
  <header id="header">
    <ul>
      <li><a to="/">Home</a></li>
      <li><a to="/about">About</a></li>
    </ul>
  </header>
`;

export default class Header {
  init(ob = spk.methods.scoped(template, style)) {
    eval(spk.data.init);
    return ob;
  }

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
