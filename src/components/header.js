import {
  spk,
  $
} from '../../lib/spk.js';

let template = `
<header id="header">
  <ul>
    <li><a to="/">Home</a></li>
    <li><a to="/about">About</a></li>
  </ul>
</header>`;

export class Header {
  init() {
    const ob = spk.methods.scoped(template, style);
    ob.cb = {};
    ob.cb[1] = this.render;
    return ob;
  }

  render() {
    const el = $('#header');

    setTimeout(() => {
      el.style.height = "100px";
    }, 2000);
    console.log('Header: render()', el);
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
}
header ul li a{
  text-decoration: none;
  color: white;
}
header ul li a:hover{
  color: green;
}`;