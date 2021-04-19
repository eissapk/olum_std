import { Router } from "../lib/pk.js";
// views
import Home from "./views/home";
import About from "./views/about";
import Edit from "./views/edit";
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
  prefix: "app",
  routes,
});