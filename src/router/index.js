import OlumRouter from "olum-router";
import Home from "../views/Home";
import About from "../views/About";

const routes = [
  { path: "/", comp: Home },
  { path: "/about", comp: About },
];

const router = new OlumRouter({ routes, mode: "history" });
export default router;
