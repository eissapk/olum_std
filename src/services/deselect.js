import { $ } from "../../lib/pk.js";
function deselect() {
  const selectAllInput = $(".selectAll input");
  if (selectAllInput) {
    selectAllInput.checked = false;
  }
}

export default deselect;
