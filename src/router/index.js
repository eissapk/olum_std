import OlumRouter from "olum/dist/router.js";

import Home from "../views/home.js";
import Settings from "../views/settings.js";
import Add from "../views/add.js";
import Edit from "../views/edit.js";
import Features from "../views/features.js";
import NotFound from "../views/notfound.js";

const routes = [
  { path: "/", comp: Home },
  { path: "/settings", comp: Settings },
  { path: "/add", comp: Add },
  { path: "/edit", comp: Edit },
  { path: "/features", comp: Features },
  { path: "/err", comp: NotFound },
];

const router = new OlumRouter({ mode: "history", root: "/", routes });
export default router;