import { Service } from "../../lib/pk.js";

class DelNote extends Service {
  constructor() {
    super("delNote");
  }
}

const delNote = new DelNote();
export default delNote;
