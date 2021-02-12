import { spk, debug } from "../../lib/spk.js";
import Header from "../components/header.js";

let template = `
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
  components = {
    Header,
  };

  init(ob = spk.methods.scoped(template, style)) {
    eval(spk.data.init);
    return ob;
  }

  render() {
    debug("Home component logic ran!");
  }
}

let style = `
  #home {
    background-color: red;
    color: white;
  }
`;
