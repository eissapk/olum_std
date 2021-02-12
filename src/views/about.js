import { spk, debug } from "../../lib/spk.js";
import Header from "../components/header.js";

let template = `
<div id="about">
  <Header/>
  <h1>about page</h1>
  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam consectetur ducimus provident facere architecto labore facilis temporibus. Vitae cumque atque placeat. Ipsam ea sit, totam nam veritatis quasi distinctio voluptate.</p>
</div>`;

export default class About {
  components = {
    Header,
  };

  init(ob = spk.methods.scoped(template, style)) {
    eval(spk.data.init);
    return ob;
  }

  render() {
    debug("About component logic ran!");
  }
}

let style = `
#about{
  background-color: blue;
  color: white;
}`;
