import { Router } from "../lib/spk.js";
// views
import Home from "./views/home.js";
import About from "./views/about.js";
import NotFound from "./views/notfound";

const router = new Router({
  mode: "history",
  root: "/",
  el: "#app",
});

router
  .add("/", Home)
  .add("/about", About)
  .add("/404", NotFound)