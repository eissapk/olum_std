import {
  spk
} from '../../lib/spk.js';
import { Header } from "../components/header.js";

const components = {
  'Header': Header
};

let template = `
<div id="about">
  <Header/>
  <h1>about page</h1>
  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam consectetur ducimus provident facere architecto labore facilis temporibus. Vitae cumque atque placeat. Ipsam ea sit, totam nam veritatis quasi distinctio voluptate.</p>
</div>`;

export default class About {
  init() {
    const ob = spk.methods.scoped(template, style);
    ob.cb = {};

    for (let key in components) {
      let num = 1;
      let pattern = new RegExp(`<${key}+(>|.*?[^?]>)`, 'gi')
      let instance = new components[key]().init();

      ob.template = ob.template.replace(pattern, instance.template); //* merge html
      ob.style += instance.style; //* merge css
      ob.cb[num++] = instance.cb[1]; //* merge js
    }

    ob.cb[99] = this.render;
    return ob;
  }

  render() {
    console.log('about: render()');
  }

}

let style = `
#about{
  background-color: blue;
  color: white;
}`;