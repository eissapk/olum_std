import { $ } from "../../lib/pk.js";
export default function searchWidth(w) {
  const container = $(".Search");
  if (container) {
    const margin = 10;
    const navigation = $(container).get(".navigation").clientWidth;
    const selectAll = $(container).get(".selectAll").clientWidth;
    const delBtn = $(container).get(".delBtn").clientWidth;
    $(".searchInput").style.width = w - (navigation + selectAll + delBtn + margin) + "px";
  }
}
