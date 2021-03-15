import { html, css, OnInit } from "../../lib/spk.js";
import Header from "../components/header/header.js";

let template = html`
<div id="about">
  <Header />
  <p>
    The app stores the tasks @ the user's browser localstorage. made by spk.js
  </p>
</div>
`;

export default class About extends OnInit{
  data = {
    name: "About",
    components: {
      Header,
    },
    template,
    style,
    render: () => this.render(),
    scoped: true,
  }
  
  constructor() {
    super();
  }

  init = () => super.init(this.data);

  render() {
    console.log("test from about component");
  }
}

let style = css`
  #about p {
    line-height: 26px;
    color: #666;
    text-align: center;
    margin: 50px 0;
  }
`;
