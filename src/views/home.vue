<template>
  <div id="home">
    <header />
    <AddTodo />
    <Todos />
  </div>
</template>

<script>
  import { OnInit, debug } from "../../lib/pk.js";
  import Header from "../components/header.js";
  import AddTodo from "../components/addtodo.js";
  import Todos from "../components/todos.js";

  export default class Home extends OnInit {
    data = {
      name: "Home",
      components: {
        Header,
        AddTodo,
        Todos,
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
      debug("test home component");
    }
  }
</script>

<style lang="scss">
  #home {
    height: 100vh;
  }
</style>
