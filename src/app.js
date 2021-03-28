import { Router } from "../lib/pk.js";
// views
import Home from "./views/home.js";
import About from "./views/about.js";
import Edit from "./views/edit.js";
import NotFound from "./views/notfound";

const routes = [
  { path: "/", comp: Home },
  { path: "/about", comp: About },
  { path: "/edit", comp: Edit },
  { path: "/404", comp: NotFound },
];

export const router = new Router({
  mode: "history",
  root: "/",
  el: "#app",
  routes,
});