import { $ } from "../../lib/pk.js";
export default function setWH(container, margin) {
  const h = window.innerHeight;
  const w = window.innerWidth;
  const nav = $(".Nav");
  const header = $(".Header");
  if (container && nav && header) {
    const height = h - (nav.clientHeight + header.clientHeight + margin) + "px";
    const width = w - margin * 2 + "px";
    container.style.height = height;
    container.style.width = width;
  }
}