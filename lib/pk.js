/**
 * @author Eissa Saber <eissapk44@gmail.com>
 * @description A simple light weight library for providing spa experience
 * @version 1.0.0
 */

((factory) => {
  const global = typeof self !== "undefined" ? self : window;
  const lib = factory(global);
  if (typeof module === "object" && module.exports) module.exports = lib;
  else global.Pk = lib.Pk;
})((global) => {
  "use strict";
  /**
   * helpers for optimizing the code
   */
  const isDebugging = true;
  const debugStr = "Pk [warn]:";
  const quotes = str => "“" + str + "”";
  const devtoolHint = `${debugStr} ${quotes("devtool extension")} is not installed!
  \nto install it please download ${quotes("devtool.js")} from the official repo
  \n@ https://github.com/eissapk/pkjs/blob/develop/devtool.js
  \nand save it in the root of your project`;
  const isDev = () => !!["localhost", "127.0.0.1"].includes(location.hostname);
  const isObj = obj => !!(obj !== null && typeof obj === "object");
  const isFullArr = arr => !!(isObj(arr) && Array.isArray(arr) && arr.length);
  const isFullObj = obj => !!(isObj(obj) && Array.isArray(Object.keys(obj)) && Object.keys(obj).length);
  const isDef = val => !!(val !== undefined && val !== null);
  const isTrue = val => !!(val === true);
  const toNum = val => parseFloat(val.replace(/\D/g, ""));
  const delItem = (arr, item) => (arr.length && arr.indexOf(item) > -1 ? arr.splice(arr.indexOf(item), 1) : null);
  const hasProp = (obj, key) => !!obj.hasOwnProperty(key);
  const delProp = (obj, key) => (hasProp(obj, key) ? delete obj[key] : null);
  const isSame = (a, b) => !!(a === b);
  const addProp = (obj, key, val) => {
    Object.defineProperty(obj, key, {
      value: val,
      writable: true,
      configurable: true,
    });
  };
  const debugLib = (args, level = "log") => {
    level = level == "err" ? "error" : level;
    if (isDebugging) Array.isArray(args) ? console[level](...args) : console[level](args);
  }
  String.prototype.upper = function () {
    return this.toUpperCase();
  };
  String.prototype.lower = function () {
    return this.toLowerCase();
  };

  /* Capitalize a string */
  String.prototype.cap = function () {
    return this.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  /* For debuging purposes, works in dev mode */
  const debug = (args, level = "log") => {
    level = level == "err" ? "error" : level;
    if (isDev()) Array.isArray(args) ? console[level](...args) : console[level](args);
  }

  /**
   * A shorthand for selecting nodes from dom
   *
   * @example $(".header") // returns 1st element
   * @example $(".header", true) // returns array
   * @example $(elm).get("li") // returns 1st li inside elm
   * @example $(elm).get("li", true) // returns array of li inside elm
   * @param {String} target can be class, id, tag or Element
   * @param {Boolean} level (optional) boolean if omited it returns 1st element otherwise (true) returns array
   */
  const $ = (target, level, el = document) => {
    if (typeof target == "string") {
      const elms = [].slice.call(el.querySelectorAll(target));
      if (isFullArr(elms)) {
        if (level) return elms;
        else return elms[0];
      } else {
        return [];
        console.error(`${debugStr} couldn't find ${quotes(target)} in dom!`);
      }
    } else {
      if (!Array.isArray(target) && !!target && target instanceof Element) target.get = (t, l) => $(t, l, target);
      return target;
    }
  };

  /**
   * A shorthand for addEventListener() - removeEventListener()
   */
  function on(event, cb, propagation = false) {
    return this.addEventListener(event, cb, propagation);
  }

  function off(event, cb, propagation = false) {
    return this.removeEventListener(event, cb, propagation);
  }
  Element.prototype.on = on;
  Element.prototype.off = off;
  Document.prototype.on = on;
  Document.prototype.off = off;
  global.on = on;
  global.off = off;

  /**
   * Replace string with values
   *
   * @example setTemp(`<div>{{name}}</div>`, {name:"pkjs"})
   */
  const setTemp = (temp, obj, delimit = ["{{", "}}"]) => {
    for (let key in obj) {
      temp = temp.replace(new RegExp(`\\${delimit[0][0]}\\${delimit[0][1]}${key}\\${delimit[1][0]}\\${delimit[1][1]}`, "g"), obj[key]);
    }
    return temp;
  }

  /**
   * Expand/Collapse element height
   *
   * @example elm.toggle(0.6)
   * @Hint CSS must have `height: 0; overflow: hidden;`
   */
  Element.prototype.toggle = function (time = 0.3) {
    this.style.transition = `height ${time}s ease-in-out`;
    if (this.clientHeight == 0) {
      this.style.height = "auto";
      const h = this.clientHeight + "px";
      this.style.height = "0";
      setTimeout(() => this.style.height = h, 0);
    } else this.style.height = "0";
  };

  /**
   * @example origin.method(url, { body: {name:"pkjs"},"Content-Type": "application/json" }).then(console.log).catch(console.error)
   */
  class Origin {
    constructor() {
      if (!(this instanceof Origin)) console.error(`${debugStr} can't invoke ${quotes("Origin constructor")} without new keyword`);
      this.xhr = new XMLHttpRequest();
    }

    setParams(data) {
      if (isFullObj(data)) {
        for (let key in data) {
          if (key !== "body") this.xhr.setRequestHeader(key, data[key]);
        }
        if (hasProp(data, "body") && isFullObj(data.body)) {
          return JSON.stringify(data.body);
        }
        return null;
      }
    }

    onload(resolve, reject) {
      return this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === 0 || (this.xhr.status >= 200 && this.xhr.status <= 299)) {
            try {
              resolve(JSON.parse(this.xhr.responseText));
            } catch (err) {
              resolve(this.xhr.responseText);
            }
          } else if (this.xhr.status >= 400 && this.xhr.status <= 599) {
            reject(`${debugStr} couldn't reach the server`);
          }
        }
      };
    }

    req(method, url, data = {}) {
      return new Promise((resolve, reject) => {
        this.xhr.open(method, url, true);
        const form = this.setParams(data);
        this.onload(resolve, reject);
        this.xhr.onerror = () => reject(`${debugStr} network error`);
        form !== null ? this.xhr.send(form) : this.xhr.send();
      });
    }

    get = (url, data = {}) => this.req("GET", url, data);
    post = (url, data = {}) => this.req("POST", url, data);
    delete = (url, data = {}) => this.req("DELETE", url, data);
    put = (url, data = {}) => this.req("PUT", url, data);
    patch = (url, data = {}) => this.req("PATCH", url, data);
  }

  /**
   * @example new Pk({
      mode: "history",
      root: "/",
      el: "#app",
      prefix: "app",
      routes: [{ path: "/", comp: Home }],
    });
   */
  class Pk {
    routes = [];
    pushStateAPI = !!global.history.pushState;

    constructor({
      mode,
      root,
      el,
      prefix,
      routes
    }) {
      if (!(this instanceof Pk)) console.error(`${debugStr} can't invoke ${quotes("Pk constructor")} without new keyword`);
      this.setMode(mode);
      this.setRoot(root);
      this.setPrefix(prefix);

      if (!this.hasRootElm(el)) {
        console.error(`${debugStr} couldn't find a value for ${quotes("el property")} @ router instance. \nmake sure it has the right selector e.g. el:"#app" \nand ${quotes("Root Element")} exists in dom e.g. <div id="app"></div>`);
      } else if (!this.hasRoutes(routes)) {
        console.error(`${debugStr} couldn't find ${quotes("routes property")} @ router instance or it's empty. \nmake sure that ${quotes("routes property")} has components \ne.g. routes = [{ path: "/", comp: Home }]`);
      } else {
        this.popStateEvent = new PopStateEvent("popstate");
        this.listen();
      }
    }

    hasRootElm(el) {
      const appMarkup = document.querySelector(el);

      if (!!el && !!appMarkup) {
        let appStyle = document.querySelector(".appStyle");
        if (!!appStyle) appStyle.remove();
        appMarkup.insertAdjacentHTML("afterend", `<style class="appStyle"></style>`);
        appStyle = document.querySelector(".appStyle");

        this.rootCompName = el.replace(/\#|\./, "").cap();
        this.appMarkup = appMarkup;
        this.appStyle = appStyle;
        return true;
      }

      return false;
    }

    hasRoutes(routes) {
      if (!!routes && isFullArr(routes)) {
        routes.forEach(route => this.addRoute(route.path, route.comp));
        return true;
      }
      return false;
    }

    setPrefix(prefix) {
      if (!!prefix) {
        this.prefix = prefix;
      } else {
        this.prefix = null;
        console.warn(`${debugStr} couldn't find ${quotes("prefix property")} @ router instance. \nfalling back to default component tag e.g. <ComponentName/>`);
      }
    }

    setRoot(root) {
      if (!!root) {
        this.root = root;
      } else {
        this.root = "/";
        console.warn(`${debugStr} couldn't find ${quotes("root property")} @ router instance. \nfalling back to default value: ${quotes("/")}`);
      }
    }

    setMode(mode) {
      if (!!mode) {
        if (this.pushStateAPI) this.mode = mode;
        else {
          this.mode = "hash"; // force hash
          console.warn(`${debugStr} mode is set to ${quotes("hash")} \n${quotes("history")} is not supported!`);
        }
      } else {
        this.mode = this.pushStateAPI ? "history" : "hash"; // default
        console.warn(`${debugStr} couldn't find ${quotes("mode property")} @ router instance. \nfalling back to available default mode: ${quotes(this.mode)}`);
      }
    }

    addRoute(path, comp) {
      this.routes.push({
        path,
        cb: () => this.inject(comp),
      });
    }

    delRoute(path) {
      this.routes.forEach(item => {
        if (item.path === path) delItem(this.routes, item);
      });
    }

    flush() {
      this.routes = [];
    }

    navigate(path = "") {
      if (this.mode === "history") {
        global.history.pushState({}, "", this.clear(path));
        debugLib("Pushed to history");
      } else if (this.mode === "hash") {
        location.href = `${location.href.replace(/\#.*/gi, "")}#${this.clear(path)}`;
      }

      dispatchEvent(this.popStateEvent);
    }

    listen() {
      const defaultRoutes = ["", `${this.root}index.html`];
      global.on("popstate", () => {
        debugLib("Dispatched Popstate");
        this.current = this.getRoute();

        const route = this.routes.find(item => {
          if (defaultRoutes.includes(this.current)) return item.path === this.root;
          else if (this.current === item.path) return item.path;
          else return item.path === this.root + "404";
        });

        if (isDef(route)) {
          route.cb(); // invokes inject(view)
          this.to(); // invokes navigate(path)
          this.active(route);
        } else {
          console.error(`${debugStr} ${quotes(`${route.path} route`)} is not defined!`);
        }

        debugLib([
          route,
          {
            current: this.current,
          },
        ]);
      });

      dispatchEvent(this.popStateEvent);
    }

    to() {
      const links = $("[to]", true);
      if (isFullArr(links)) {
        links.forEach(link => {
          // disable href in anchor
          if (link.nodeName === "A") link.setAttribute("href", "javascript:void(0)");
          // disable icons in links
          [...link.children].forEach(icon => (icon.style.pointerEvents = "none"));

          // onclick
          link.on("click", e => {
            const a = this.clear(e.target.getAttribute("to"));
            const b = this.getRoute();
            if (isSame(a, b)) return; // stop routing | preserve history from duplicated routes
            this.navigate(a); // navigate to clicked route
          });
        });
      }
    }

    buildTree(entry) {
      const compsArr = [];
      const recursive = comp => {
        if (hasProp(comp, "components") && isFullObj(comp.components)) {
          for (let key in comp.components) {
            const obj = {};
            addProp(obj, "parent", comp.name);
            addProp(obj, "child", {});
            addProp(obj.child, "name", key);
            const instance = new comp.components[key]();
            addProp(obj.child, "data", instance.data());
            compsArr.push(obj);

            if (hasProp(obj, "child") && hasProp(obj.child, "data")) {
              const nextEntry = obj.child.data;
              recursive(nextEntry);
            }
          }
        }
      };
      recursive(entry);
      debugLib(["compsArr", compsArr]);

      return compsArr;
    }

    inject(View) {
      if (!View || typeof View != "function") {
        console.error(`${debugStr} ${quotes("View argument")} is missing or it's not a constructor function! @ Pk.inject(View)`);
      } else {
        const view = new View();
        const entry = view.data();
        const compsArr = this.buildTree(entry);
        try {
          // labeling components in dev mode
          const label = isDev() ? this.label(entry, compsArr) : {
            entry,
            compsArr
          };
          // final component 
          const viewObj = this.merge(label);
          // html
          this.appMarkup.innerHTML = viewObj.template;
          // css
          this.appStyle.innerHTML = viewObj.style;
          // js | make sure js runs last one to get the real markup values e.g height prop of an element
          setTimeout(() => {
            for (let key in viewObj.script) viewObj.script[key]();
          }, 0);
          // devtool
          if (isDev()) import("/devtool.js").then(module => new module.default(this.appMarkup)).catch(() => console.warn(devtoolHint));

        } catch (err) {
          console.error(err);
        }

      }
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
          entry.template = entry.template.replace(compWrapper[0], compWrapper[0].replace(greaterCharRegex, ` pk-component="${name}" router-view="${name}">`));
        }
      }

      // root (placeholder)
      this.appMarkup.setAttribute("pk-component", this.rootCompName);

      return {
        entry,
        compsArr,
      };
    }

    merge({
      entry,
      compsArr
    }) {
      // parent (view) 
      let template = entry.template || "";
      let style = entry.style || "";
      const script = {};
      !!(entry.render) ? (script[0] = entry.render) : null;

      // children 
      if (isFullArr(compsArr)) {
        compsArr.forEach((comp, index) => {
          const data = comp.child.data;
          const html = data.template || "";
          const css = data.style || "";
          const js = data.render || null;
          const name = this.prefix !== null ? this.prefix + "-" + data.name : data.name;
          const regex = new RegExp(`<(${name}\\s{0,})\\/>`, "gi"); // detect components e.g. <App-AddTodo /> or <AddTodo />

          template = template.replace(regex, html);
          style += css;
          if (js !== null) script[index + 1] = js;
        });
      }

      return {
        template,
        style,
        script,
      };
    }

    clear(path) {
      return path.toString().lower().trim();
    }

    getRoute() {
      let fragment = "";
      if (this.mode === "history") {
        fragment = this.clear(decodeURI(location.pathname));
        fragment = this.root !== "/" ? fragment.replace(this.root, "") : fragment;
      } else if (this.mode === "hash") {
        fragment = this.clear(decodeURI(location.hash));
        fragment = fragment.replace(/^\#/, "") || "";
      }
      return this.clear(fragment);
    }

    active(route) {
      const links = $("[to]", true);
      if (isFullArr(links)) {
        links.forEach(link => {
          if (this.clear(link.getAttribute("to")) === route.path) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    }

  }

  /**
   * @example const event = new Service("eventName");
   * window.on(event.event, () => console.log("fired"));
   * event.trigger()
   */
  class Service {
    constructor(event) {
      if (!(this instanceof Service)) console.error(`${debugStr} can't invoke ${quotes("Service constructor")} without new keyword`);
      this.event = event;
      this.init();
      return this;
    }

    init() {
      this.serviceEvent = new CustomEvent(this.event, {
        detail: {},
        bubbles: true,
        cancelable: true,
        composed: false,
      });
    }

    trigger() {
      if (isDef(this.serviceEvent)) dispatchEvent(this.serviceEvent);
    }
  }

  return {
    Pk,
    Service,
    Origin,
    $,
    debug,
    setTemp,
  };

});