import { Router } from "../lib/pk.js";
import Home from "./views/home";
import Settings from "./views/settings";
import NotFound from "./views/notfound";
import Add from "./views/add";
import Edit from "./views/edit";

const routes = [
  { path: "/", comp: Home },
  { path: "/add", comp: Add },
  { path: "/edit", comp: Edit },
  { path: "/settings", comp: Settings },
  { path: "/404", comp: NotFound },
];

export const router = new Router({
  mode: "history",
  root: "/",
  el: "#app",
  prefix: "app",
  routes,
});