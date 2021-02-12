import { Router, spk } from "../lib/spk.js";
// views 
import Home from "./views/home.js";
import About from "./views/about.js";

const router = new Router({
  mode: "history",
  root: "/",
});

router
  .add("/", () => spk.methods.component(Home))
  .add("/about", () => spk.methods.component(About));