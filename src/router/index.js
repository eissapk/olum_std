import OlumRouter from "olum-router";
import Board from "../views/Board";
import Settings from "../views/Settings";

const routes = [
  { path: "/board", comp: Board },
  { path: "/settings", comp: Settings },
];

const router = new OlumRouter({ routes, mode: "history" });

export default router;
