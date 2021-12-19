import OlumRouter from "olum-router";
import Home from "../views/Home";

const routes = [ { path: "/", comp: Home } ];

const router = new OlumRouter({ routes });

export default router;