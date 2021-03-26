/**
 * @author Eissa Saber <eissapk44@gmail.com>
 * @description A simple light weight library for providing spa experience
 * @version 1.0.0
 */

const debugStr = "PKjs [WARN]: ";
const quotes = str => "“" + str + "”";

/**
 * For debuging purposes, works in dev mode only.
 * 
 * @example debug("this is a string", "log");
 * @see any passed global array will be spreaded
 * @param {*} args accepts all types (object, array, number, string, ...etc)
 * @param {*} level (optional) accept all console methods
 * 
 */
export const debug = (args, level = "log") => {
  level = level == "err" ? "error" : level;
  const env = ["localhost", "127.0.0.1"].includes(location.hostname) ? "dev" : "";
  if (env == "dev") Array.isArray(args) ? console[level](...args) : console[level](args);
};

/**
 * A shorthand for selecting nodes from dom
 * 
 * @example $("#header") // returns 1st element
 *
 * @example $("#header", true) // returns array
 *
 * @example $(elm).get("li") // returns 1st li inside elm tag
 *
 * @example $(elm).get("li", true) // returns array of li inside elm tag
 *
 * @param {*} target can be class, id, tag or Element
 * @param {*} level (optional) boolean if omited it returns 1st element otherwise (true) returns array
 */
export const $ = (target, level, el = document) => {
  let elms;

  if (typeof target == "string") {
    // selector as string
    elms = [].slice.call(el.querySelectorAll(target));
    if (elms.length) {
      if (level) return elms;
      else return elms[0];
    } else {
      console.error(`${debugStr}${quotes(target)} doesn't exist in dom!`);
    }
  } else {
    // element as reference
    elms = target;
    if (!Array.isArray(elms)) elms.get = (t, l) => $(t, l, elms);
    return elms;
  }
};

/**
 * A shorthand for addEventListener()
 * 
 * @example btn.on("click", e => console.log(e))
 *
 * @param {*} event click, keyup , ...etc
 * @param {*} cb callback function
 * @param {*} propagation (optional) default is false
 */

function on(event, cb, propagation = false) {
  const hint = " @ on(event, cb, propagation)";
  const elm = this;
  const events = [];
  for (let x in window) {
    if (/\bon/.test(x)) events.push(String(x).trim().replace(/^on/, ""));
  }

  try {
    if (typeof event != "string") {
      console.error(`${debugStr}${quotes(event)} must be a string.${hint}`);
    } else if (!events.includes(event.trim())) {
      console.error(`${debugStr}${quotes(event)} not a valid event!${hint}`);
    } else if (typeof cb != "function") {
      console.error(`${debugStr}${quotes(cb)} not a function.${hint}`);
    } else if (elm == null) {
      console.error(`${debugStr}couldn't find ${quotes(elm)} in dom!${hint}`);
    } else if (typeof propagation != "boolean") {
      console.error(`${debugStr}${quotes(propagation)} must be a boolean.${hint}`);
    } else {
      return elm.addEventListener(event.toLowerCase().trim(), e => cb(e), propagation);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * A shorthand for removeEventListener()
 * 
 * @example btn.off("click", myFunc)
 *
 * @param {*} event click, keyup , ...etc
 * @param {*} cb callback function
 * @param {*} propagation (optional) default is false
 */
function off(event, cb, propagation = false) {
  const hint = " @ off(event, cb, propagation)";
  const elm = this;
  const events = [];
  for (let x in window) {
    if (/\bon/.test(x)) events.push(String(x).trim().replace(/^on/, ""));
  }

  try {
    if (typeof event != "string") {
      console.error(`${debugStr}${quotes(event)} must be a string.${hint}`);
    } else if (!events.includes(event.trim())) {
      console.error(`${debugStr}${quotes(event)} not a valid event!${hint}`);
    } else if (typeof cb != "function") {
      console.error(`${debugStr}${quotes(cb)} not a function.${hint}`);
    } else if (elm == null) {
      console.error(`${debugStr}couldn't find ${quotes(elm)} in dom!${hint}`);
    } else if (typeof propagation != "boolean") {
      console.error(`${debugStr}${quotes(propagation)} must be a boolean.${hint}`);
    } else {
      return elm.removeEventListener(event.toLowerCase().trim(), e => cb(e), propagation);
    }
  } catch (err) {
    console.error(err);
  }
}

Element.prototype.on = on;
Document.prototype.on = on;

Element.prototype.off = off;
Document.prototype.off = off;

/**
 * Replace markup (string) with matched values
 * 
 * @example setTemp(`<div>{{name}}</div>`, {name:"pkjs"})
 * 
 * @param temp markup as string
 *
 * @param obj object with all keys/values to be replaced with markup
 *
 * @param delimit (optional) accepts array of string, default is ["{{", "}}"]
 * 
 */
export const setTemp = (temp, obj, delimit = ["{{", "}}"]) => {
  for (let key in obj) {
    temp = temp.replace(new RegExp(`\\${delimit[0][0]}\\${delimit[0][1]}${key}\\${delimit[1][0]}\\${delimit[1][1]}`, "g"), obj[key]);
  }
  return temp;
};

/**
 * Convert a string to upper case
 * 
 * @example "this is a text".upper() 
 */
String.prototype.upper = function () {
  return this.toUpperCase();
};

/**
 * Convert a string to lower case
 * 
 * @example "THIS IS A TEXT".lower()
 */
String.prototype.lower = function () {
  return this.toLowerCase();
};

/**
 * Capitalize a string
 * 
 * @example "this is a STRING".cap()
 */
String.prototype.cap = function () {
  // return this.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  return this.toLowerCase().replace(/(^[a-z])|([ ][a-z])/gi, s => s.toUpperCase());
};

/**
 * Expand/Collapse element height
 * 
 * @example elm.toggle(0.6) 
 * 
 * @param time (optional) transition timing
 * 
 * @see CSS must have `height: 0; overflow: hidden;`
 */
Element.prototype.toggle = function (time = 0.3) {
  this.style.transition = `height ${time}s ease-in-out`;
  if (this.clientHeight == 0) {
    this.style.height = "auto";
    const h = this.clientHeight + "px"; // capture height
    this.style.height = "0";
    setTimeout(() => (this.style.height = h), 0); // expand
  } else {
    this.style.height = "0"; // collapse
  }
};

/**
 * Origin is for communicating with server
 *
 * @method get
 * @method post
 * @method delete
 * @method put
 */
export class Origin {
  /**
   * Get data from server
   * 
   * @example origin.get(url, {"Content-Type": "application/json"})
   *  .then(res => console.log(res))
   *  .catch(err => console.error(err))
   */
  get(url, data = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);

      for (let key in data) {
        if (key != "body") {
          xhr.setRequestHeader(key, data[key]);
        }
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 0 || xhr.status === 200) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (err) {
              resolve(xhr.responseText);
            }
          } else {
            reject(`Couldn't reach the server`);
          }
        }
      };
      xhr.onerror = () => reject("Network Error");

      xhr.send();
    });
  }

  /**
   * Add data to server
   * 
   * @example origin.post(url, { body: {name:"pkjs"},"Content-Type": "application/json" })
   *  .then(res => console.log(res))
   *  .catch(err => console.error(err))
   *
   */
  post(url, data = {}) {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);

      for (let key in data) {
        if (key == "body") {
          for (let key_ in data.body) {
            form.append(key_, data.body[key_]);
          }
        } else {
          xhr.setRequestHeader(key, data[key]);
        }
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 0 || xhr.status === 200) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (err) {
              resolve(xhr.responseText);
            }
          } else {
            reject(`Couldn't reach the server`);
          }
        }
      };
      xhr.onerror = () => reject("Network Error");

      xhr.send(form);
    });
  }

  /**
   * Delete data on server
   * 
   * @example origin.delete(url)
   *  .then(res => console.log(res))
   *  .catch(err => console.error(err))
   *  
   */
  delete(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("DELETE", url, true);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 0 || xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(`Couldn't reach the server`);
          }
        }
      };

      xhr.onerror = () => reject("Network Error");

      xhr.send();
    });
  }

  /**
   * Edit data on server
   * 
   * @example origin.put(url, { body: {name:"pkjs"} })
   *  .then(res => console.log(res))
   *  .catch(err => console.error(err))
   * 
   */
  put(url, data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 0 || xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(`Couldn't reach the server`);
          }
        }
      };

      xhr.onerror = () => reject("Network Error");

      xhr.send(JSON.stringify(data.body));
    });
  }
}

/**
 * `Router` for single page application
 */
export class Router {
  routes = [];
  mode = null;
  root = "/";
  events = ["popstate", "DOMContentLoaded", "load"];

  constructor({ mode, root, el }) {
    this.mode = window.history.pushState ? "history" : "hash";
    if (mode) this.mode = mode;
    if (root) this.root = root;
    if (el) this.el = el;
    this.listen();
  }

  /**
   *
   * @param path for route e.g. "/about"
   * @param cb for initializing the component related to that route
   */
  add(path, comp) {
    this.routes.push({
      path,
      cb: () => this.inject(comp),
    });
    return this;
  }

  remove(path) {
    for (let i = 0; i < this.routes.length; i += 1) {
      if (this.routes[i].path === path) {
        this.routes.slice(i, 1);
      }
    }
    return this;
  }

  flush() {
    this.routes = [];
    return this;
  }

  clear(path) {
    return path.toString().toLowerCase().trim();
  }

  getFragment() {
    let fragment = "";
    if (this.mode === "history") {
      fragment = this.clear(decodeURI(window.location.pathname + window.location.search));
      fragment = fragment.replace(/\?(.*)$/, "");
      fragment = this.root !== "/" ? fragment.replace(this.root, "") : fragment;
    } else {
      const match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : "";
    }
    return this.clear(fragment);
  }

  listen() {
    this.to(); // init to attribute e.g. to="/about"

    this.events.forEach(event =>
      window.addEventListener(event, () => {
        if (this.current === this.getFragment()) return;
        this.current = this.getFragment();

        const route = this.routes.find(item => {
          if (this.current === "" || this.current === "/index.html") {
            // home page
            return item.path === "/";
          } else if (this.current === item.path) {
            // home page, other pages
            return item.path;
          } else {
            // not found page
            return item.path === "/404";
          }
        });
        if (typeof route != "undefined") {
          route.cb();
          this.to();

          // add active class to current route
          const links = [].slice.call(document.querySelectorAll("[to]"));
          links.forEach(link => {
            if (this.clear(link.getAttribute("to")) === route.path) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }

        console.log({
          current: this.current,
        });
        console.log(route);
      })
    );
    console.log("listen()");
  }

  /**
   *
   * @param path for navigating the spa e.g "/about"
   */
  navigate(path = "") {
    if (this.mode === "history") {
      window.history.pushState(null, null, this.clear(path));
      const popStateEvent = new PopStateEvent("popstate");
      dispatchEvent(popStateEvent);
    } else {
      window.location.href = `${window.location.href.replace(/#(.*)$/, "")}#${this.clear(path)}`;
    }
    console.log("navigate()");
    return this;
  }

  /**
   * Navigate to a route by clicking links
   *
   * `<a href="javascript:void(0)" to="/about">About</a>`
   */
  to() {
    const links = [].slice.call(document.querySelectorAll("[to]"));
    if (links.length) {
      links.forEach(link => {
        if (link.nodeName === "A") {
          link.setAttribute("href", "javascript:void(0)");
        }

        // onclick
        link.addEventListener("click", e => {
          let attr = this.clear(e.target.getAttribute("to"));
          let current = this.getFragment();

          if (current === attr) return;
          this.navigate(attr);
        });
      });
    }
  }

  // inject class component "View" to dom
  inject(View) {
    // console.clear();

    const compWrapperRegex = /<[a-z].*(spk-).*(-component)?.*[^\/]>/gi; // detect -> <div spk-home-component>
    const compAttrRegex = /(spk-).*(-component)/gi; // detect -> spk-home-component
    const cleanRegex = /[\n\r]|\u21b5|↵/g;
    const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index); // extract duplications in an array
    const uniqueArr = (arr, key) => [...new Map(arr.map(item => [item[key], item])).values()]; // unique array of object based on object props

    const root = document.querySelector(this.el);
    if (!root) {
      console.error(`Root element is not found!`);
    } else if (!View) {
      console.error(`Missing class component argument`);
    } else if (!View instanceof Object) {
      console.error(`Wrong argument, must be class component!`);
    } else {
      const view = new View();
      const comp = view.init();
      const compName = comp.name || view.constructor.name + " View";

      console.groupCollapsed(compName);
      console.trace(comp);
      console.groupEnd();

      const compKeys = Object.keys(comp);
      if (Array.isArray(compKeys) && compKeys.length && comp.template && comp.style && comp.cb && comp.sha) {
        root.innerHTML = comp.template; //! inject html

        // extract components wrappers for devtools extension
        console.groupCollapsed("duplications");
        const allComps = comp.template.match(compWrapperRegex);
        console.log("all comps", allComps);
        if (allComps.length) {
          const compAttrArr = allComps.map(item => {
            const item_ = item.match(compAttrRegex);
            if (item_.length) return item_[0];
          });
          console.log("all comps attr", compAttrArr);

          const finalCompsSelectors = [...new Set(compAttrArr)];
          console.log("final components selectors", finalCompsSelectors);
          console.groupEnd();

          // devtools
          console.groupCollapsed("devtools | App Tree");
          finalCompsSelectors.forEach(comp => {
            const comps = root.querySelector(`[${comp}]`);
            console.log(comps);
          });
          console.groupEnd();
        }

        //! inject css
        // wipe out
        const styles = document.querySelectorAll(`style[id^="__spk-view__"]`);
        if (styles.length) styles.forEach(item => item.remove());
        // root.insertAdjacentHTML("afterend", `<style id="__spk-view__${comp.sha}">${comp.style}</style>`);

        // handle styles duplications
        console.groupCollapsed("styles duplications");
        let stylesArr = comp.style.split("}"); // make array of each selector
        console.log("make array", stylesArr);

        if (stylesArr.length) {
          stylesArr = stylesArr.map(item => item.replace(cleanRegex, "").trim());
          console.log("clean", stylesArr);

          // remove duplications
          stylesArr = [...new Set(stylesArr)];
          console.log("remove duplications", stylesArr);

          // make string
          let stylesStr = stylesArr.join("}");
          console.log("final styles", stylesStr);

          // inject clean styles
          root.insertAdjacentHTML("afterend", `<style id="__spk-view__${comp.sha}">${stylesStr}</style>`);
        }
        console.groupEnd();

        //! run js
        const fnKeys = Object.keys(comp.cb);
        if (Array.isArray(fnKeys) && fnKeys.length) {
          for (let key in comp.cb) {
            let fn = comp.cb[key];
            if (typeof fn == "function") {
              fn();
            } else {
              console.error("Not a function!");
            }
          }
        }
      } else {
        console.error(`Component is empty!`);
      }
    }
  }
}

/**
 *
 */
export class OnInit {
  attrRegex = /data-spk=\"([^"]*)\"|data-spk/gi; // detect -> data-spk="" | data-spk
  compAttrRegex = /(spk-).*(-component)/gi; // detect -> spk-home-component
  openingTagRegex = /<[a-z]+(>|.*?[^?]>)/gi; // detect -> <tag> | </tag>
  openingSelfTagRegex = /<(.*)\/>/gi; // detect -> </tag>
  selfClosingRegex = /\/\>/gi; // detect -> "/>"
  greaterCharRegex = /\>/gi; // detect -> ">"
  curlyRegex = /\s*\{/g; // detect -> "{"

  constructor() {}

  init({ name = "", components = {}, template = "", style = "", render, scoped = true }) {
    const ob = this.scope(name, components, template, style, scoped);
    return this.merge(name, components, ob, render);
  }

  scope(name, components, template, style, scoped) {
    const sha = name.toLowerCase() || new Date().getTime();
    let openingTagArr;

    // clean
    template = template.replace(this.attrRegex, "").replace(this.compAttrRegex, "");

    // add component name to its wrapper
    const compWrapper = template.match(this.openingTagRegex);
    if (compWrapper.length) {
      template = template.replace(compWrapper[0], compWrapper[0].replace(this.greaterCharRegex, ` spk-${name.toLowerCase()}-component>`));
    }
    console.groupCollapsed("add component name");
    console.trace(template);
    console.groupEnd();

    if (scoped === true) {
      // template
      openingTagArr = template.match(this.openingTagRegex); // extract opening tags

      console.groupCollapsed("scope | initial with component name");
      console.trace(template);
      console.groupEnd();

      // 1- replace self-closing tag <tag/>
      if (openingTagArr.length) {
        openingTagArr.forEach(item => (template = template.replace(item, item.replace(this.selfClosingRegex, ` data-spk="${sha}"/>`))));
      }

      console.groupCollapsed("scope | replace self-closing tag <tag/>");
      console.trace(template);
      console.groupEnd();

      // 2- replace opening tag <tag>
      openingTagArr = template.match(this.openingTagRegex); // get <tag> & </tag>
      if (openingTagArr.length) {
        // remove self-closing tags </tag> and the remaining will be <tag> as required no.2 above
        openingTagArr = openingTagArr.filter(item => !item.match(this.openingSelfTagRegex));
        if (openingTagArr.length) {
          openingTagArr.forEach(item => (template = template.replace(item, item.replace(this.greaterCharRegex, ` data-spk="${sha}">`))));
        }
      }

      console.groupCollapsed("scope | replace opening tag <tag>");
      console.trace(template);
      console.groupEnd();

      // clean self-closing components
      const compKeys = Object.keys(components);
      if (Array.isArray(compKeys) && compKeys.length) {
        for (let key in components) {
          const compRegex = new RegExp(`<(.*${key}.*)\\/>`, "gi"); // e.g. <Header />
          const extractedCompArr = template.match(compRegex);
          if (extractedCompArr.length) {
            extractedCompArr.forEach(item => (template = template.replace(item, item.replace(this.attrRegex, ""))));
          }
        }
      }

      console.groupCollapsed("scope | clean self-closing components");
      console.trace(template);
      console.groupEnd();

      // style
      style = style.replace(this.curlyRegex, `[data-spk="${sha}"]{`);

      console.groupCollapsed("scope | style");
      console.trace(style);
      console.groupEnd();

      return {
        template,
        style,
        sha,
      };
    } else {
      return {
        template,
        style,
        sha,
      };
    }
  }

  merge(name, components, ob, render) {
    let num = 0;
    ob.cb = {};
    ob.cb["view"] = () => render();

    // replace self-closing components with their actual markup
    const compKeys = Object.keys(components);
    if (Array.isArray(compKeys) && compKeys.length) {
      for (let key in components) {
        // ignore current view
        if (key != name) {
          // console.trace({ name, key });
          num++;

          const compRegex = new RegExp(`<(.*${key}.*)\\/>`, "gi"); // detect components e.g. <Header/>
          const classComp = new components[key]();
          const comp = classComp.init();

          const extractedCompArr = ob.template.match(compRegex);
          if (extractedCompArr.length) {
            extractedCompArr.forEach(item => (ob.template = ob.template.replace(item, comp.template))); // merge html
          }

          ob.style += comp.style; // merge css
          ob.cb[`${key.toLowerCase()}_${num}`] = comp.cb["view"]; // merge js
        }
      }
    }

    return ob;
  }
}

/**
 * (HTML,CSS) Syntax highlighter inside javascript
 */
const lit = (s, ...args) => s.map((ss, i) => `${ss}${args[i] || ""}`).join("");
export const css = lit;
export const html = lit;
