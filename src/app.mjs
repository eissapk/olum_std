import { Olum } from "../lib/olum.js";
import Home from "./views/home.js";
import Settings from "./views/settings.js";
import NotFound from "./views/notfound.js";
import Add from "./views/add.js";
import Edit from "./views/edit.js";
import Features from "./views/features.js";

const routes = [
  { path: "/404", comp: NotFound },
  { path: "/add", comp: Add },
  { path: "/edit", comp: Edit },
  { path: "/features", comp: Features },
  { path: "/settings", comp: Settings },
  { path: "/", comp: Home },
];

export const olum = new Olum({
  mode: "history",
  root: "/",
  el: "#app",
  prefix: "app",
  err: "/404",
  routes,
});

// if ("serviceWorker" in navigator) { // uncomment to enable service worker when deploying
//   window.on("load", () => navigator.serviceWorker.register("/service-worker.js").catch(console.error));
// }