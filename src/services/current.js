import { $ } from "../../lib/pk.js";
import api from "../services/api.js";
export default function getCurrentTab() {
  const tab = $(".Tabs .activeTab");
  if (!!tab) {
    api.current.tabName = $(tab).get(".tab__title").value.trim();
    api.current.tabId = tab.getAttribute("data-tabid");
    return true;
  }
  return false;
}
