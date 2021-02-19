import { spk, html, css } from "../../lib/spk.js";
import Header from "../components/header.js";

let template = html`
<div id="about">
  <Header />
  <p>
    The app stores the tasks @ the user's browser localstorage. made by spk.js
  </p>
</div>
`;

export default class About {
  components = {
    Header
  }

  init(ob = spk.methods.scoped(template, style)) {
    eval(spk.data.init);
    return ob;
  }

  render() {}
}

let style = css`
  #about p {
    line-height: 26px;
    color: #666;
    text-align: center;
    margin: 50px 0;
  }
`;
