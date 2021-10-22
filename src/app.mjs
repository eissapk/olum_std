import Olum from "olum";
import router from "./router/index.js";

import Home from "./views/home.js";


// new Olum("app").$("#app").use(Home);
new Olum("app").$("#app").use(router);
