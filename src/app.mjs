import Olum from "olum";
import router from "./router/index.js";

import Home from "./views/home.js";

// new Olum({ prefix: "app" }).$("#app").use(Home);
new Olum({ prefix: "app" }).$("#app").use(router);
