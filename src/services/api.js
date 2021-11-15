import { Service } from "olum-helpers";

class Api extends Service {
  constructor() {
    super("olum_api_event");
  }
  currentCardId = null;
}

const api = new Api();
export default api;