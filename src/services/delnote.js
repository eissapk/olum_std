import { Service } from "../../lib/olum.js";
class DelNote extends Service {
  constructor() {
    super("delNote");
  }
}

const delNote = new DelNote();
export default delNote;
