<template>
  <div id="about">
    <header />
    <p>The app stores the tasks @ the user's browser localstorage. made by spk.js</p>
  </div>
</template>

<script>
  import { OnInit, debug } from "../../lib/pk.js";
  import Header from "../components/header.js";

  export default class About extends OnInit {
    data = {
      name: "About",
      components: {
        Header,
      },
      template,
      style,
      render: () => this.render(),
    };

    constructor() {
      super();
    }

    init = () => super.init(this.data);

    render() {
      debug("test about component");
    }
  }
</script>

<style lang="scss">
  #about {
    p {
      line-height: 26px;
      color: #666;
      text-align: center;
      margin: 50px 0;
    }
  }
</style>
