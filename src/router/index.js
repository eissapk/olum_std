import OlumRouter from "olum-router";
import Board from "../views/Board";
import Settings from "../views/Settings";
import Card from "../views/Card";

const routes = [
  { path: "/", comp: Board },
  { path: "/settings", comp: Settings },
  { path: "/card", comp: Card },
];

const router = new OlumRouter({ routes, mode: "history" });

export default router;
