import { Service } from "../../lib/pk.js";

class Api extends Service {
  current = {};
  activeTab = null
  key = "myNoteApp";
  constructor() {
    super("Api");
  }

  add(obj) {
    const data = this.get();
    data.push(obj);
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  get() {
    let data;
    if (localStorage.getItem(this.key) === null) {
      data = [];
      localStorage.setItem(this.key, JSON.stringify(data));
    } else {
      data = JSON.parse(localStorage.getItem(this.key));
    }
    return data;
  }
}

const api = new Api();
export default api;
