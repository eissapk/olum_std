import { spk, debug } from "../../lib/spk.js";

let template = `
<header id="header">
  <ul>
    <li><a to="/">Home</a></li>
    <li><a to="/about">About</a></li>
  </ul>
</header>`;

export default class Header {
  init(ob = spk.methods.scoped(template, style)) {
    eval(spk.data.init);
    return ob;
  }

  render() {
    debug("Header component logic ran!");
  }
}

let style = `
header{
height: 50px;
line-height: 50px;
background-color: #333;
}
header ul{
  list-style-type: none;
  padding: 0;
  margin: 0;
}
header ul li{
  display: inline-block;
  color: white;
  margin: 0 5px;
}
header ul li a{
  text-decoration: none;
  color: white;
}
header ul li a:hover{
  color: green;
}`;
