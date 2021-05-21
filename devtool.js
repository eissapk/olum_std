const isObj = obj => !!(obj !== null && typeof obj === "object");
const isFullArr = arr => !!(isObj(arr) && Array.isArray(arr) && arr.length);
const hasProp = (obj, key) => !!obj.hasOwnProperty(key);
export default class DevTool {
  template() {
    return `
  <div class="DevTool">
    <div class="DevTool__header">
      <button type="button" class="DevTool__header--closeBtn">&#10005;</button>
      <span class="DevTool__header__logo">${this.logo}</span>
    </div>
    <div class="DevTool__body">${this.root()}</div>
    <style>
      ${this.style()}
    </style>
  </div>
  <div class="DevTool__layer"><span></span></div>
`;
  }

  style() {
    return `.DevTool {
  box-sizing: border-box;
  font-family: Helvetica, Arial, sans-serif;
  user-select: none;
  color: #333;
  position: fixed;
  min-width: 200px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
  z-index: 999;
}
.DevTool button {
  padding: 0;
}
.DevTool__header {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #dfdfe0;
  background: #f5f5f5;
  border-radius: 5px 5px 0 0;
}
.DevTool__header:active {
  cursor: grab;
}
.DevTool__header__logo {
  float: left;
  height: 25px;
  width: 25px;
  vertical-align: bottom;
  margin: 7.5px;
  pointer-events: none;
}
.DevTool__header__logo svg {
  width: 100%;
  height: 100%;
}
.DevTool__header--closeBtn {
  float: right;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 1.2rem;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
}
.DevTool__body {
  overflow: auto;
  max-height: 200px;
  margin: 5px 0 5px 5px;
  padding-right: 5px;
}
.DevTool__body::-webkit-scrollbar {
  width: 4px;
}
.DevTool__body::-webkit-scrollbar-thumb {
  box-shadow: none;
  background: #61cd4b;
  border-radius: 5px;
}
.DevTool__body::-webkit-scrollbar-track {
  box-shadow: none;
  background: #eee;
  border-radius: 5px;
}
.DevTool__body__root {
  overflow: hidden;
}
.DevTool__body__root [pk-component] {
  padding-left: 20px;
  padding-top: 5px;
  /* reset */
  display: block;
  height: auto !important;
  background: transparent !important;
}
.DevTool__body__root [pk-component]:first-of-type {
  padding: 0;
}
.DevTool__body__root .line {
  cursor: pointer;
  position: relative;
  padding: 0 30px;
  padding-right: 56px;
  overflow: hidden;
}
.DevTool__body__root .line span {
  pointer-events: none;
  float: left;
  height: 30px;
  line-height: 30px;
  font-weight: bold;
}
.DevTool__body__root .line .chars {
  color: #c1c1c1;
}
.DevTool__body__root .line .name {
  color: #61cd4b;
  margin: 0 1px;
  letter-spacing: 0.4px;
}
.DevTool__body__root .line .view {
  background: #ff853e;
  padding: 0 5px;
  border-radius: 5px;
  color: white;
  height: 22px;
  line-height: 22px;
  margin: 4px 0 4px 10px;
  font-size: 15px;
}
.DevTool__body__root .line .scroll {
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  position: absolute;
  right: 17px;
  top: 2.5px;
}
.DevTool__body__root .line .scroll svg {
  pointer-events: none;
  width: 100%;
  height: 100%;
  fill: #8a898b;
}
.DevTool__body__root .line:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #61cd4b;
  z-index: -1;
  border-radius: 5px;
  opacity: 0;
  transition: 0.1s all ease;
}
.DevTool__body__root .line:hover:after {
  opacity: 1;
}
.DevTool__body__root .line:hover .name,
.DevTool__body__root .line:hover .chars {
  color: white;
}
.DevTool__body__root .line:hover .scroll svg {
  fill: white;
}
.DevTool__body__root .caret [pk-component] {
  display: none;
}
.DevTool__body__root .caret.active > [pk-component] {
  display: block;
}
.DevTool__body__root .caret > .line::before {
  position: absolute;
  top: 50%;
  left: 11px;
  content: "";
  border: 5px solid transparent;
  border-left-color: #666;
  border-left-width: 8px;
  transition: 0.1s all ease-in-out;
  transform-origin: top left;
  transform: translateY(-50%);
  pointer-events: none;
}
.DevTool__body__root .caret.active > .line::before {
  transform: rotate(90deg) translateY(-50%);
  left: 15px;
  margin-top: -4px;
}
.DevTool__layer {
  background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5) 10px, rgba(198, 228, 255, 0.5) 10px, rgba(198, 228, 255, 0.5) 20px);
  border: 1px dashed #2196f3;
  position: fixed;
  z-index: 1;
  justify-content: center;
  align-items: center;
  display: none;
  box-sizing: border-box;
  font-family: Helvetica, Arial, sans-serif;
  user-select: none;
  flex-flow: column nowrap;
  place-content: center;
  align-items: center;
}
.DevTool__layer span {
  position: relative;
  background: #66b8ff;
  padding: 5px 20px;
  border-radius: 5px;
  color: white;
  letter-spacing: 0.4px;
  font-weight: bold;
}
.DevTool__layer span::before,
.DevTool__layer span::after {
  position: absolute;
  top: 50%;
  color: white;
  transform: translateY(-50%);
}
.DevTool__layer span::before {
  content: "\\003C";
  left: 8px;
}
.DevTool__layer span::after {
  content: "\\003E";
  right: 8px;
}`;
  }

  global = typeof self !== "undefined" ? self : window;
  isDown = false;
  isActive = false;
  startX;
  startY;
  currentX;
  currentY;
  walkX;
  walkY;
  logo = `<svg viewBox="0 0 475 475" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M472.937 20.788c.567-3.067-1.807-5.788-4.925-5.788H89.647a5 5 0 0 0-4.914 4.076l-82.152 436.7c-.868 4.613 4.538 7.931 8.23 5.033C44.009 434.746 147.29 358.32 231 346.5c41.376-5.842 68.432 16.082 107 0 47.399-19.765 64-60 83-102 17.01-37.601 46.042-191.818 51.937-223.712z" fill="#6bc045"/><g fill="#303030"><path d="M259 223.5L233.5 170l39-10.5 32.5 14 12.5 25 71 109s-3.453 7.862-23 23.5C343 349 339 346 339 346l-80-122.5zm-96-132h67.5l-33 177.5-80.5 41.5 46-219z"/><path d="M262.5 160.5h-47L203 222h64l-4.5-61.5z"/><path d="M303 92h78.5l-69 100-40 7.5-13.5-40L303 92z"/></g></svg>`;
  eye = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"/></svg>`;

  constructor(appMarkup, rootCompName) {
    this.appMarkup = appMarkup;
    this.rootCompName = rootCompName;

    this.render();
  }

  render() {
    this.global.devtool = this.devtool.bind(this);
  }

  label(root, arr) {
    const compAttrRegex = /(pk-component=[\"\']([^\"|\']*)[\"\'])|(pk-component)/gi;
    const openingSelfClosingTagRegex = /<[a-z]+(>|.*?[^?]>)/gi;
    const greaterCharRegex = /\>/gi;
    const compsArr = [...arr];
    const entry = root;

    // children
    compsArr.forEach(comp => {
      const name = comp.child.data.name || "undefined";
      if (comp.child && comp.child.data && hasProp(comp.child.data, "template")) {
        const data = comp.child.data;
        // clean
        data.template = data.template.replace(compAttrRegex, "");
        // labeling
        const compWrapper = data.template.match(openingSelfClosingTagRegex);
        if (isFullArr(compWrapper)) {
          data.template = data.template.replace(compWrapper[0], compWrapper[0].replace(greaterCharRegex, ` pk-component="${name}">`));
        }
      }
    });

    // parent (view)
    if (entry.template) {
      const name = entry.name || "undefined";
      // clean
      entry.template = entry.template.replace(compAttrRegex, "");
      // labeling
      const compWrapper = entry.template.match(openingSelfClosingTagRegex);
      if (isFullArr(compWrapper)) {
        entry.template = entry.template.replace(
          compWrapper[0],
          compWrapper[0].replace(greaterCharRegex, ` pk-component="${name}" router-view="${name}">`)
        );
      }
    }

    // root (placeholder)
    this.appMarkup.setAttribute("pk-component", this.rootCompName);

    return {
      entry,
      compsArr,
    };
  }

  removeDevtool(btn, template, layer) {
    if (!!btn && !!template && !!layer) {
      btn.addEventListener("click", () => {
        template.remove();
        layer.remove();
      });
      this.global.addEventListener("popstate", () => {
        template.remove();
        layer.remove();
      });
    }
  }

  root() {
    const root = document.createElement("div");
    root.className = "DevTool__body__root";
    const clonedTree = this.appMarkup.cloneNode(true);
    // clean tree
    const elms = clonedTree.querySelectorAll("*");
    elms.forEach(elm => {
      this.clean(elm);
      if (!elm.getAttribute("pk-component")) elm.remove();
    });
    this.clean(clonedTree);
    root.append(clonedTree);

    const comps = root.querySelectorAll("[pk-component]");
    comps.forEach(comp => {
      if (!!comp.childElementCount) comp.className = "caret";
      const lt = `<span class="chars">&lt;</span>`;
      const gt = `<span class="chars">&gt;</span>`;
      const name = `<span class="name">${comp.getAttribute("pk-component")}</span>`;
      const view = comp.getAttribute("router-view") ? `<span class="view">router-view</span>` : "";
      const scroll = `<button type="button" class="scroll" data-name="${comp.getAttribute("pk-component")}">${this.eye}</button>`;
      const line = `<div class="line">${lt + name + gt + view + scroll}</div>`;
      comp.insertAdjacentHTML("afterbegin", line);
    });

    return root.outerHTML;
  }

  devtool() {
    let template = document.querySelector(".DevTool");
    if (!template) {
      document.body.insertAdjacentHTML("beforeend", this.template());
      template = document.querySelector(".DevTool");
      if (!!template) {
        const btn = template.querySelector(".DevTool__header--closeBtn");
        const header = template.querySelector(".DevTool__header");
        const layer = document.querySelector(".DevTool__layer");
        if (!!btn && !!header && !!layer) {
          this.center(template); // center devtool in view-port
          template.addEventListener("click", e => this.toggle(e)); // toggle tree components
          template.addEventListener("click", e => this.scroll(e)); // scroll into view
          this.removeDevtool(btn, template, layer); // when closing or navigating
          // make devtool dragable
          header.addEventListener("touchstart", e => this.dragStart(e, template));
          header.addEventListener("mousedown", e => this.dragStart(e, template));
          header.addEventListener("touchmove", e => this.dragMove(e, template));
          header.addEventListener("mousemove", e => this.dragMove(e, template));
          header.addEventListener("mouseup", () => (this.isDown = false), (this.isActive = false));
          header.addEventListener("touchend", () => (this.isDown = false), (this.isActive = false));
          header.addEventListener("mouseleave", () => (this.isActive = false));
          // layer
          template.addEventListener("mousemove", e => this.displayLayer(e, layer));
        }
      }
    }
  }

  dragStart(e, template) {
    e = e || this.global.event;
    this.isDown = true;
    this.isActive = true;
    if (e.type == "mousedown") {
      this.startX = e.pageX - template.offsetLeft;
      this.startY = e.pageY - template.offsetTop;
    } else {
      // touch
      this.startX = e.touches[0].clientX - template.offsetLeft;
      this.startY = e.touches[0].clientY - template.offsetTop;
    }
  }

  dragMove(e, template) {
    e = e || this.global.event;
    let left = template.offsetLeft;
    let top = template.offsetTop;
    if (this.isDown && this.isActive) {
      if (e.type == "mousemove") {
        this.currentX = e.pageX - template.offsetLeft;
        this.currentY = e.pageY - template.offsetTop;
      } else {
        // touch
        this.currentX = e.touches[0].clientX - template.offsetLeft;
        this.currentY = e.touches[0].clientY - template.offsetTop;
      }
      this.walkX = this.currentX - this.startX;
      this.walkY = this.currentY - this.startY;
      left += this.walkX;
      top += this.walkY;
      template.style.left = left + "px";
      template.style.top = top + "px";
    }
  }

  clean(elm) {
    if (!!elm) {
      elm.removeAttribute("id");
      elm.removeAttribute("class");
      elm.removeAttribute("style");
      const children = [...elm.childNodes];
      if (Array.isArray(children) && children.length) {
        children.forEach(node => (node.nodeType === Node.TEXT_NODE ? node.remove() : null));
      }
    }
  }

  center(template) {
    if (!!template) {
      template.style.left = (this.global.innerWidth - template.offsetWidth) / 2 + "px";
      template.style.top = (this.global.innerHeight - template.offsetHeight) / 2 + "px";
    }
  }

  toggle(e) {
    if (e.target.classList.contains("line") && e.target.parentElement.classList.contains("caret")) {
      const caret = e.target.parentElement;
      caret.classList.toggle("active");
    }
  }

  scroll(e) {
    if (e.target.classList.contains("scroll")) {
      const name = e.target.getAttribute("data-name");
      const comp = document.querySelector(`[pk-component="${name}"]`);
      if (!!comp) comp.scrollIntoView({ behavior: "smooth" });
    }
  }

  displayLayer(e, layer) {
    if (e.target.classList.contains("line")) {
      const compName = e.target.parentElement.getAttribute("pk-component");
      const currentComp = document.querySelector(`[pk-component="${compName}"]`);
      const rect = currentComp.getBoundingClientRect();
      const left = rect.left;
      const top = rect.top;
      const width = rect.width;
      const height = rect.height;
      layer.style.width = width + "px";
      layer.style.height = height + "px";
      layer.style.left = left + "px";
      layer.style.top = top + "px";
      layer.querySelector("span").textContent = compName;
      layer.style.display = "flex";
    } else {
      layer.style.display = "none";
    }
  }
}
