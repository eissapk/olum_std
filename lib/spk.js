/**
 * @author Eissa Saber <eissapk44@gmail.com>
 * @description A simple light weight library for providing spa experience
 * @version 1.0.0
 */

/**
 * `debug(msg, level)`
 *
 * `level` log, trace, warn, err, error
 *
 * `msg` accepts reference & primitive
 */
export const debug = (msg, level = "trace") => {
  const levels = ["log", "trace", "warn", "err", "error"];
  try {
    if (msg) {
      if (typeof level != "string") {
        console.error(`debug(msg, level): level must be a string.`);
      } else if (!levels.includes(String(level).toLowerCase().trim())) {
        console.error(`debug(msg, level): level must be one of these: (${levels.join(" , ")})`);
      } else if (typeof msg == "string") {
        if (/log/i.test(level.trim())) {
          return console.log(
            "%c%s%c%s",
            "color:white; padding:3px 6px; border-radius:1px; background:#3392fa; margin: 0 5px 2px 0",
            "🥝 LOG",
            "color:#666; font-weight:bold;",
            `${msg}`
          );
        } else if (/trace/i.test(level.trim())) {
          return console.trace(
            "%c%s%c%s",
            "color:white; padding:3px 6px; border-radius:1px; background:#3392fa; margin: 0 5px 2px 0",
            "🥝 TRACE",
            "color:#666; font-weight:bold;",
            `${msg}`
          );
        } else if (/warn/i.test(level.trim())) {
          return console.warn(
            "%c%s%c%s",
            "color:white; padding:3px 6px; border-radius:1px; background:#fbc32f; margin: 0 5px 2px 0",
            "🥝 WARN",
            "color:#666; font-weight:bold;",
            `${msg}`
          );
        } else if (/err|error/i.test(level.trim())) {
          return console.error(
            "%c%s%c%s",
            "color:white; padding:3px 6px; border-radius:1px; background:#fc6159; margin: 0 5px 2px 0",
            "🥝 ERROR",
            "color:#666; font-weight:bold;",
            `${msg}`
          );
        }
      } else if (typeof msg != "string") {
        if (/log/i.test(level.trim())) {
          return console.log("%c%s%c", "color:white; padding:3px 6px; border-radius:1px; background:#3392fa; margin: 0 5px 2px 0", "🥝 LOG", "", msg);
        } else if (/trace/i.test(level.trim())) {
          return console.trace(
            "%c%s%c",
            "color:white; padding:3px 6px; border-radius:1px; background:#3392fa; margin: 0 5px 2px 0",
            "🥝 TRACE",
            "",
            msg
          );
        } else if (/warn/i.test(level.trim())) {
          return console.warn(
            "%c%s%c",
            "color:white; padding:3px 6px; border-radius:1px; background:#fbc32f; margin: 0 5px 2px 0",
            "🥝 WARN",
            "",
            msg
          );
        } else if (/err|error/i.test(level.trim())) {
          return console.error(
            "%c%s%c",
            "color:white; padding:3px 6px; border-radius:1px; background:#fc6159; margin: 0 5px 2px 0",
            "🥝 ERROR",
            "",
            msg
          );
        }
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * `$(target, level)`
 *
 * `target` accepts class, id, tag (support nesting as CSS)
 *
 * `level` (optional) accepts number
 *
 * `1` selects `1st element`, `2` selects `2nd element` and so on.
 *
 *  if `level is not specified` and there is `only one element` in dom then it `returns that element`, other than that it `returns array`
 */
export const $ = (target, level) => {
  let current;
  const elms = [].slice.call(document.querySelectorAll(target));
  try {
    if (typeof target == "string") {
      if (elms.length) {
        if (level) {
          if (typeof level == "number") {
            current = level > elms.length - 1 ? elms[elms.length - 1] : elms[level - 1];
          } else {
            debug("err", "$(target, level): level must have a number.");
          }
        } else {
          current = elms.length > 1 ? elms : elms[0];
        }
      } else {
        debug("err", `$(target, level): couldn't find target of “${target}” in the dom!`);
      }
    } else {
      debug("err", "$(target, level): target must be a string.");
    }
    return current;
  } catch (err) {
    debug("err", err);
  }
};

/**
 * `injectText(temp, obj, delimit)`
 *
 * `temp` accepts html as string
 *
 * `obj` includes the text to be injected
 *
 * `delimit` (optional) accepts array of string, default is ["{{", "}}"]
 */
export const injectText = (temp, obj, delimit = ["{{", "}}"]) => {
  for (let key in obj) {
    temp = temp.replace(new RegExp(`\\${delimit[0][0]}\\${delimit[0][1]}${key}\\${delimit[1][0]}\\${delimit[1][1]}`, "g"), obj[key]);
  }
  return temp;
};

/**
 * `elm.on(event, cb, propagation)`
 *
 * `event` the native javascript evetns such as `click`, `keyup` and so on
 *
 * `cb` a callback function
 *
 * `elm` a dom element which triggers the event
 *
 * `propagation` (optional) default is false
 */
Element.prototype.on = function (event, cb, propagation = false) {
  const events = [];
  for (let x in window) {
    if (/\bon/.test(x)) events.push(String(x).replace(/^on/, ""));
  }
  try {
    if (typeof event != "string") {
      debug("err", `on(event, cb, propagation): “${event}” must be a string.`);
    } else if (!events.includes(event.trim())) {
      debug("err", `on(event, cb, propagation): “${event}” not a valid event!`);
    } else if (typeof cb != "function") {
      debug("err", `on(event, cb, propagation): “${cb}” must be a function.`);
    } else if (!!this === false) {
      debug("err", `on(event, cb, propagation): couldn't find “${this}” in the dom!`);
    } else if (typeof propagation != "boolean") {
      debug("err", `on(event, cb, propagation): “${propagation}” must be a boolean.`);
    } else {
      event = event.toLowerCase().trim();
      return this.addEventListener(event, e => cb(e), propagation);
    }
  } catch (err) {
    debug("err", err);
  }
};

/**
 * `document.on(event, cb, propagation)`
 *
 * `event` the native javascript evetns such as `click`, `keyup` and so on
 *
 * `cb` a callback function
 *
 * `document` a dom element which triggers the event
 *
 * `propagation` (optional) default is false
 */
Document.prototype.on = function (event, cb, propagation = false) {
  const events = [];
  for (let x in window) {
    if (/\bon/.test(x)) events.push(String(x).replace(/^on/, ""));
  }
  try {
    if (typeof event != "string") {
      debug("err", `on(event, cb, propagation): “${event}” must be a string.`);
    } else if (!events.includes(event.trim())) {
      debug("err", `on(event, cb, propagation): “${event}” not a valid event!`);
    } else if (typeof cb != "function") {
      debug("err", `on(event, cb, propagation): “${cb}” must be a function.`);
    } else if (typeof propagation != "boolean") {
      debug("err", `on(event, cb, propagation): “${propagation}” must be a boolean.`);
    } else {
      event = event.toLowerCase().trim();
      return this.addEventListener(event, e => cb(e), propagation);
    }
  } catch (err) {
    debug("err", err);
  }
};

/**
 * `string.upper()` convert a string to upper case
 */
String.prototype.upper = function () {
  return this.toUpperCase();
};

/**
 * `string.lower()` convert a string to lower case
 */
String.prototype.lower = function () {
  return this.toLowerCase();
};

/**
 * `elm.toggle()` expand/collapse element height
 *
 * `CSS must have these styles`
 *
 *    height: 0;
 *    overflow: hidden;
 *    transition: height 0.3s ease-in-out;
 *
 */
Element.prototype.toggle = function () {
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
 * `origin` is meant for communicating with the server
 *
 * includes methods such as `('GET', 'POST', 'DELETE', 'PUT')`
 */
export class Origin {
  /**
   * `origin.get(url, data)`
   *
   * `.then(data => console.log(data))`
   *
   * `.catch(err => console.error(err));`
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
   * `origin.post(url, { body: { name: 'john doe', age: 50 } })`
   *
   * `.then(data => console.log(data))`
   *
   * `.catch(err => console.error(err));`
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
   * `origin.delete(url)`
   *
   *  `.then(data => console.log(data))`
   *
   *  `.catch(err => console.error(err));`
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
   * `origin.put(url, { body: { name: 'john doe', age: 50 } })`
   *
   * `.then(data => console.log(data))`
   *
   * `.catch(err => console.error(err));`
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

  constructor({
    mode,
    root,
    el
  }) {
    this.mode = window.history.pushState ? "history" : "hash";
    if (mode) this.mode = mode;
    if (root) this.root = root;
    if (el) this.el = el;
    this.listen();
  }

  // inject class component "View" to dom
  inject(View) {
    const root = document.querySelector(this.el);
    if (!root) {
      debug(`Root element is not found!`, "err");

    } else if (!View) {
      debug(`Missing class component argument`, "err");

    } else if (!View instanceof Object) {
      debug(`Wrong argument, must be class component!`, "err");

    } else {
      const view = new View();
      const comp = view.init();
      const compName = comp.name || view.constructor.name + " View";

      console.groupCollapsed(compName);
      debug(comp);
      console.groupEnd();

      const compKeys = Object.keys(comp);
      if (Array.isArray(compKeys) && compKeys.length && comp.template && comp.style && comp.cb && comp.sha) {
        root.innerHTML = comp.template; // inject html

        // inject css
        const styles = document.querySelectorAll(`style[id^="__comp__"]`);
        if (styles.length) styles.forEach(item => item.remove());
        root.insertAdjacentHTML("afterend", `<style id="__comp__${comp.sha}">${comp.style}</style>`);

        // run js
        const fnKeys = Object.keys(comp.cb);
        if (Array.isArray(fnKeys) && fnKeys.length) {
          for (let key in comp.cb) {
            let fn = comp.cb[key];
            if (typeof fn == "function") {
              fn();
            } else {
              debug('Not a function!', "err");
            }
          }
        }

      } else {
        debug(`Component is empty!`, "err");
      }

    }

  }

  /**
   *
   * @param path for route e.g. "/about"
   * @param cb for initializing the component related to that route
   */
  add(path, comp) {
    this.routes.push({
      path,
      cb: () => this.inject(comp)
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
    // return path.toString().replace(/\/$/, "").replace(/^\//, "");
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
    console.log("to()");

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
}

/**
 * syntax highlighting
 */
const lit = (s, ...args) => s.map((ss, i) => `${ss}${args[i] || ""}`).join("");
export const css = lit;
export const html = lit;

/**
 *
 */
export class OnInit {
  attrRegex = /data-spk=\"([^"]*)\"|data-spk/gi; // detect -> data-spk="" | data-spk
  openingTagRegex = /<[a-z]+(>|.*?[^?]>)/gi; // detect -> <tag> | <tag/>
  openingTagRegex_ = /<([^\/>]+)>/gi; // detect -> <tag>
  selfClosingRegex = /\/\>/gi; // detect -> "/>"
  greaterCharRegex = /\>/gi; // detect -> ">"
  curlyRegex = /\s*\{/g; // detect -> "{" 

  constructor() {}

  init({
    name = "",
    components = {},
    template = "",
    style = "",
    render,
    scoped = true
  }) {
    let ob = this.scope(name, components, template, style, scoped);
    ob = this.merge(components, ob, render);
    return ob;
  }

  scope(name, components, template, style, scoped) {
    const sha = new Date().getTime();
    let openingTagArr;

    // console.groupCollapsed('scope');

    // add component name to its wrapper
    const compWrapper = template.match(this.openingTagRegex_);
    if (compWrapper.length) {
      template = template.replace(compWrapper[0], compWrapper[0].replace(this.greaterCharRegex, ` data-${name.toLowerCase()}-component>`));
    }
    console.warn("add component name to its wrapper", template);

    if (scoped === true) {
      // template
      template = template.replace(this.attrRegex, ""); // clean
      openingTagArr = template.match(this.openingTagRegex); // extract opening tags
      console.warn("initial", template);

      // 1- replace self-closing tag <tag/>
      if (openingTagArr.length) {
        openingTagArr.forEach(item => template = template.replace(item, item.replace(this.selfClosingRegex, ` data-spk="${sha}"/>`)));
      }
      console.warn("replace self-closing tag <tag/>", template);

      // 2- replace opening tag <tag>
      openingTagArr = template.match(this.openingTagRegex_);
      if (openingTagArr.length) {
        openingTagArr.forEach(item => template = template.replace(item, item.replace(this.greaterCharRegex, ` data-spk="${sha}">`)));
      }
      console.warn("replace opening tag <tag>", template);

      // clean self-closing components 
      const compKeys = Object.keys(components);
      if (Array.isArray(compKeys) && compKeys.length) {
        for (let key in components) {
          const compRegex = new RegExp(`<(.*${key}.*)\\/>`, "gi"); // e.g. <Header />
          const extractedCompArr = template.match(compRegex);
          if (extractedCompArr.length) {
            extractedCompArr.forEach(item => template = template.replace(item, item.replace(this.attrRegex, "")));
          }
        }
      }
      console.warn("clean self-closing components", template);

      // style
      style = style.replace(this.curlyRegex, `[data-spk="${sha}"]{`);
      console.warn("style", style);

      // console.groupEnd("scope");

      return {
        template,
        style,
        sha
      };

    } else {
      return {
        template,
        style,
        sha
      };
    }

  }

  merge(components, ob, render) { // todo fix this
    let num = 1;
    ob.cb = {};

    // replace self-closing components with their actual markup
    const compKeys = Object.keys(components);
    if (Array.isArray(compKeys) && compKeys.length) {
      for (let key in components) {
        num += 1;
        const compRegex = new RegExp(`<(.*${key}.*)\\/>`, "gi"); // detect components e.g. <Header/>
        const ClassComp = new components[key]();
        const initialize = ClassComp.init();
        // const initialize = ClassComp.data;

        const extractedCompArr = ob.template.match(compRegex);
        if (extractedCompArr.length) {
          extractedCompArr.forEach(item => ob.template = ob.template.replace(item, initialize.template)); // merge html
        }

        ob.style += initialize.style; // merge css
        ob.cb[num] = initialize.cb[1]; // merge js
        // ob.cb[num] = ()=> ClassComp.render(); // merge js

      }
    }

    ob.cb[1] = () => render();

    return ob;
  }

}