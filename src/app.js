import { Router } from "../lib/spk.js";
// views
import Home from "./views/home.js";
import About from "./views/about.js";

const router = new Router({
  mode: "history",
  root: "/",
  el: "#app",
});

router
  .add("/", () => router.inject(Home))
  .add("/about", () => router.inject(About));
