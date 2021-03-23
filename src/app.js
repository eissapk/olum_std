import { Router } from "../lib/pk.js";
// views
import Home from "./views/home.js";
import About from "./views/about.js";
import Edit from "./views/edit.js";
import NotFound from "./views/notfound";

export const router = new Router({
  mode: "history",
  root: "/",
  el: "#app",
});

router
  .add("/", Home)
  .add("/about", About)
  .add("/edit", Edit)
  .add("/404", NotFound);