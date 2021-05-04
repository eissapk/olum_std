import { Service } from "../../lib/pk.js";

class Api extends Service {
  current = {};
  key = "myNoteApp";
  tabKey = this.key + "_lastTab";
  constructor() {
    super("currentTab");
  }

  addNote(obj) {
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

  editTab() {
    const data = this.get();
    data.forEach(obj => {
      if (obj.tabId === this.current.tabId) {
        obj.tabName = this.current.tabName;
      }
    });

    localStorage.setItem(this.key, JSON.stringify(data));
  }

  removeTab(id) {
    const filteredArr = this.get().filter(obj => obj.tabId !== id);
    localStorage.setItem(this.key, JSON.stringify(filteredArr));
  }

  saveLastTab() {
    localStorage.setItem(this.tabKey, JSON.stringify(this.current.tabId));
  }

  hasLastTab() {
    if (localStorage.getItem(this.tabKey) === null) {
      return false;
    }
    return JSON.parse(localStorage.getItem(this.tabKey));
  }
}

const api = new Api();
export default api;
