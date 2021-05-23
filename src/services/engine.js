import { Service } from "../../lib/pk.js";

class Engine extends Service {
  query = null
  constructor() {
    super("Engine");
  }

}

export const engine = new Engine();
