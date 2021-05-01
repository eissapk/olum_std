import { $ } from "../../lib/pk.js";
export const setDimensions = (selector, margin) => {
  const h = window.innerHeight;
  const w = window.innerWidth;
  const container = $(selector);
  if (container) {
    const nav = $(".Nav").clientHeight;
    const header = $(".Header").clientHeight;
    const height = h - (nav + header + margin) + "px";
    const width = w - margin * 2 + "px";
    container.style.height = height;
    container.style.width = width;
  }
};