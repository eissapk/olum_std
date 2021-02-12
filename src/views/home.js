const lit = (s, ...args) => s.map((ss, i) => `${ss}${args[i] || ""}`).join("");
const css = lit;
const html = lit;
import { spk, $ } from "../../lib/spk.js";
import { Header } from "../components/header.js";
let components = {
  Header,
};

let template = html`
  <div id="home">
    <header />
    <h1>home page</h1>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam
      consectetur ducimus provident facere architecto labore facilis temporibus.
      Vitae cumque atque placeat. Ipsam ea sit, totam nam veritatis quasi
      distinctio voluptate.
    </p>
  </div>
`;

export default class Home {
  init() {
    const ob = spk.methods.scoped(template, style);
    ob.cb = {};

    for (let key in components) {
      let num = 1;
      let pattern = new RegExp(`<${key}+(>|.*?[^?]>)`, "gi");
      let instance = new components[key]().init();

      ob.template = ob.template.replace(pattern, instance.template); //* merge html
      ob.style += instance.style; //* merge css
      ob.cb[num++] = instance.cb[1]; //* merge js
    }

    ob.cb[99] = this.render;
    return ob;
  }

  render() {
    const el = $("#home");
    setTimeout(() => {
      el.style.background = "orange";
    }, 2000);
    console.log("home: render()");
  }
}

let style = css`
  #home {
    background-color: red;
    color: white;
  }
`;
