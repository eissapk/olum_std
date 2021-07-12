import { Service } from "../../lib/olum.js";

class Engine extends Service {
  query = null
  constructor() {
    super("Engine");
  }

}

export const engine = new Engine();
