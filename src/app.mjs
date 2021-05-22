import { Pk }  from "../lib/pk.js";
import Home from "./views/home.js";
import Settings from "./views/settings.js";
import NotFound from "./views/notfound.js";
import Add from "./views/add.js";
import Edit from "./views/edit.js";
import Features from "./views/features.js";

const routes = [
  { path: "/", comp: Home },
  { path: "/add", comp: Add },
  { path: "/edit", comp: Edit },
  { path: "/settings", comp: Settings },
  { path: "/404", comp: NotFound },
  { path: "/features", comp: Features },
];

export const pk = new Pk({
  mode: "history",
  root: "/",
  el: "#app",
  prefix: "app",
  routes,
});