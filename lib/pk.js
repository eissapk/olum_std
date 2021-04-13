/**
 * @author Eissa Saber <eissapk44@gmail.com>
 * @description A simple light weight library for providing spa experience
 * @version 1.0.0
 */

const debugStr = "PKjs [warn]: ";
const quotes = str => "“" + str + "”";

/**
 * For debuging purposes, works in dev mode only.
 *
 * @example debug("this is a string", "log");
 * @see any passed global array will be spreaded
 * @param {*} args accepts all types (object, array, number, string, ...etc)
 * @param {*} level (optional) accept all console methods
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
 * @example $("#header", true) // returns array
 * @example $(elm).get("li") // returns 1st li inside elm tag
 * @example $(elm).get("li", true) // returns array of li inside elm tag
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
      console.error(`${debugStr}${quotes(target)} not in dom!`);
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
// Element.prototype.off = off;
// Document.prototype.off = off;

/**
 * Replace markup (string) with matched values
 *
 * @example setTemp(`<div>{{name}}</div>`, {name:"pkjs"})
 * @param temp markup as string
 * @param obj object with all keys/values to be replaced with markup
 * @param delimit (optional) accepts array of string, default is ["{{", "}}"]
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
 * @param time (optional) transition timing
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
 * PKjs Router
 * 
 * @example 
 *  new Router({
      mode: "history",
      root: "/",
      el: "#app",
      routes: [{"/about", About}]
    })
 * 
 * @default 
 * mode "history"
 * root "/"
 * 
 * @method add 
 * @method remove
 * @method flush
 * @method clear
 * @method getFragment
 * @method listen
 * @method navigate
 * @method to
 * @method active
 * @method inject
 */
export class Router {
  routes = [];
  root = "/";
  pushStateAPI = !!window.history.pushState;

  constructor({
    mode,
    root,
    el,
    routes
  }) {

    if (this.rootElmExists(el)) {
      this.popStateEvent = new PopStateEvent("popstate");

      // routes
      if (routes) routes.forEach(route => this.add(route.path, route.comp));
      else console.error(`${debugStr}${quotes("routes array")} is not assigned @ router instance!`);

      // mode
      if (mode) {
        if (this.pushStateAPI) this.mode = mode;
        else this.mode = "hash"; // force hash
      } else {
        this.mode = this.pushStateAPI ? "history" : "hash"; // default
      }

      // root
      if (root) this.root = root;

      this.listen();

    } else {
      console.error(`${debugStr}make sure that ${quotes("el property")} @ router instance has the right selector e.g. el:"#app" \nand ${quotes("Root Element")} exists in dom e.g. <div id="app"></div>`);
    }

  }

  rootElmExists(el) {
    const appMarkup = document.querySelector(el);

    if (el && appMarkup) {
      let appStyle = document.querySelector(".appStyle");
      if (appStyle) appStyle.forEach(item => item.remove());
      appMarkup.insertAdjacentHTML("afterend", `<style class="appStyle"></style>`);
      appStyle = document.querySelector(".appStyle");

      this.appMarkup = appMarkup;
      this.appStyle = appStyle;
      return true;
    }

    return false;
  }

  /**
   * Adds passedroute
   *
   * @example add("/", Home)
   * @param path accepts a string
   * @param comp accepts instance of component class
   */
  add(path, comp) {
    this.routes.push({
      path,
      cb: () => this.inject(comp),
    });
    return this;
  }

  /**
   * removes passed route
   *
   * @example remove("/about")
   * @param path accepts a string
   */
  remove(path) {
    this.routes.forEach((item, index, array) => {
      if (item.path === path) array.splice(index, 1);
    });
    return this;
  }

  /**
   * Wipes out all routes
   *
   * @example flush()
   */
  flush() {
    this.routes = [];
    return this;
  }

  /**
   * Navigates to passed route path via dispatching popstate event via `history.pushState()` or `location.href`
   *
   * @param path string for a specific route e.g. "/about"
   * @example navigate("/about")
   */
  navigate(path = "") {
    if (this.mode === "history") {
      history.pushState({}, "", this.clear(path));
      debug("Pushed to history");
    } else if (this.mode === "hash") {
      location.href = `${location.href.replace(/\#.*/gi, "")}#${this.clear(path)}`;
    }

    dispatchEvent(this.popStateEvent);
    return this;
  }

  /**
   * Listener for any change in location (hostname, hash)
   *
   * 1- Invokes the component "View" callback e.g. route.cb()
   *
   * 2- Invokes to() which navigates to routes via clicking tags that have `to` attribute
   *
   * 3- Invokes active() which adds active class to current route link tag
   */
  listen() {
    window.addEventListener("popstate", () => {
      debug("Dispatched Popstate");
      this.current = this.getFragment();

      const route = this.routes.find(item => {
        if (this.current === "" || this.current === "/index.html") return item.path === this.root;
        else if (this.current === item.path) return item.path;
        else return item.path === "/404";
      });

      if (typeof route != "undefined") {
        route.cb(); // invokes inject(view)
        this.to(); // invokes navigate(path)
        this.active(route);
      } else {
        console.error(`${debugStr}${quotes(`${route.path} route`)} is not defined!`);
      }

      debug([
        route,
        {
          current: this.current,
        },
      ]);
    });

    dispatchEvent(this.popStateEvent);
  }

  /**
   * Navigate to routes via clicking tags that have `to` attribute
   *
   * @example <a href="javascript:void(0)" to="/about">About</a>
   */
  to() {
    const links = [].slice.call(document.querySelectorAll("[to]"));
    links.forEach(link => {
      // disable href in anchor
      if (link.nodeName === "A") link.setAttribute("href", "javascript:void(0)");
      // disable icons in links
      [...link.children].forEach(icon => (icon.style.pointerEvents = "none"));

      // onclick
      link.addEventListener("click", e => {
        const attr = this.clear(e.target.getAttribute("to"));
        const current = this.getFragment();
        if (current === attr) return; // stop routing | preserve history from duplicated routes

        this.navigate(attr); // navigate to clicked route
      });
    });
  }

  /**
   * Injects component template, style and runs callbacks
   *
   * @param {*} View accepts component reference
   */
  inject(View) {
    if (!View) {
      console.error(`${debugStr}${quotes("View argument")} is missing! @ Router.inject(View)`);
    } else {
      const compsArr = [];
      const view = new View();
      const entry = view.data();
      let tree = [];

      const recursive = comp => {
        const compsKeysArr = Object.keys(comp.components);
        const hasComponents = comp.hasOwnProperty("components") && Array.isArray(compsKeysArr) && compsKeysArr.length;
        if (hasComponents) {
          for (let key in comp.components) {
            const obj = {};
            obj.parent = comp.name;
            obj.child = {};
            obj.child.name = key;
            const instance = new comp.components[key]();
            obj.child.data = instance.data();
            compsArr.push(obj);

            if (obj.hasOwnProperty("child") && obj.child.hasOwnProperty("data")) {
              const nextEntry = obj.child.data;
              recursive(nextEntry);
            }
          }
        }
      };
      recursive(entry);
      debug(["compsArr", compsArr]);

      const sequence = [...new Set([...compsArr.map(item => item.parent)])];
      debug(["sequence", sequence]);

      // tree 
      compsArr.forEach(item => tree.push([item.parent, item.child.name]));
      tree.forEach(arr => {
        const node = arr[0];
        sequence.forEach((parent, index) => {
          if (node === parent) {
            const placeholder = sequence.map((item, ind) => {
              if (ind <= index) return item;
            }).filter(item => typeof item != "undefined");
            arr.splice(0, 1, ...placeholder);
          }
        });
      });

      try {
        const obj = this.merge(entry, compsArr);
        // html 
        this.appMarkup.innerHTML = obj.template;
        // css 
        this.appStyle.innerHTML = obj.style;
        // js 
        for (let key in obj.script) obj.script[key]();
        // devtool 
        window.devTool = () => debug([tree, this.appMarkup]);
      } catch (err) {
        console.error(err);
      }

    }
  }

  merge(entry, compsArr) {
    let template = !!entry.template ? entry.template : "";
    let style = !!entry.style ? entry.style : "";
    let script = {};
    (!!entry.render ? script[0] = entry.render : null);

    compsArr.forEach((comp, index) => {
      const data = comp.child.data;
      const html = !!data.template ? data.template : "";
      const css = !!data.style ? data.style : "";
      const js = !!data.render ? data.render : null;
      const regex = new RegExp(`<(${data.name}\\s{0,})\\/>`, "gi"); // detect components e.g. <AddTodo />

      template = template.replace(regex, html);
      style += css;
      if (js != null) script[index + 1] = js;
    });

    return {
      template,
      style,
      script,
    }

  }

  clear(path) {
    return path.toString().toLowerCase().trim();
  }

  getFragment() {
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
    const links = [].slice.call(document.querySelectorAll("[to]"));
    if (links.length) {
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
 * Handles scoping and merging all components into one view
 *
 * @property app refers to app container which holds current view
 * @method init
 * @method scope
 * @method merge
 */
export class OnInit {
  attrRegex = /data-pk=\"([^"]*)\"|data-pk/gi; // detect -> data-pk="" | data-pk
  compAttrRegex = /(pk-).*(-component)/gi; // detect -> pk-home-component
  htmlComment = /\<\!\-\-(?:.|\n|\r)*?-->/gi; // detect ->  <!-- This is comment -->
  openingTagRegex = /<[a-z]+(>|.*?[^?]>)/gi; // detect -> <tag> | <tag/>
  openingSelfTagRegex = /<(.*)\/>/gi; // detect -> <tag/>
  selfClosingRegex = /\/\>/gi; // detect -> "/>"
  greaterCharRegex = /\>/gi; // detect -> ">"
  curlyRegex = /\s*\{/g; // detect -> "{"

  constructor() {
    this.app = !!window.pkApp ? document.querySelector(window.pkApp) : document.body;
  }

  init(data) {
    const ob = this.scope(data);
    return this.merge(data, ob);
  }

  scope(data) {
    const sha = data.name ? data.name.toLowerCase() : new Date().getTime();
    let openingTagArr;

    // clean
    data.template = data.template.replace(this.attrRegex, "").replace(this.compAttrRegex, "").replace(this.htmlComment, "");

    // add component name to its wrapper
    const compWrapper = data.template.match(this.openingTagRegex);
    if (compWrapper.length) {
      data.template = data.template.replace(
        compWrapper[0],
        compWrapper[0].replace(this.greaterCharRegex, ` pk-${data.name.toLowerCase()}-component>`)
      );
    }
    debug("comp name", "groupCollapsed");
    debug(data.template);
    debug("", "groupEnd");

    // implement scoping
    if (!data.hasOwnProperty("scoped") || data.scoped === true) {
      // template
      openingTagArr = data.template.match(this.openingTagRegex); // extract opening tags

      // 1- replace self-closing tag <tag/>
      if (openingTagArr.length) {
        openingTagArr.forEach(item => (data.template = data.template.replace(item, item.replace(this.selfClosingRegex, ` data-pk="${sha}"/>`))));
      }

      debug("self-closing <tag/>", "groupCollapsed");
      debug(data.template);
      debug("", "groupEnd");

      // 2- replace opening tag <tag>
      openingTagArr = data.template.match(this.openingTagRegex); // get <tag> & </tag>
      if (openingTagArr.length) {
        // remove self-closing tags <tag/> and the remaining will be <tag> as required no.2 above
        openingTagArr = openingTagArr.filter(item => !item.match(this.openingSelfTagRegex));
        if (openingTagArr.length) {
          openingTagArr.forEach(item => (data.template = data.template.replace(item, item.replace(this.greaterCharRegex, ` data-pk="${sha}">`))));
        }
      }

      debug("opening tag <tag>", "groupCollapsed");
      debug(data.template);
      debug("", "groupEnd");

      // clean self-closing components
      if (data.components) {
        const compKeys = Object.keys(data.components);
        if (Array.isArray(compKeys) && compKeys.length) {
          for (let key in data.components) {
            const compRegex = new RegExp(`<(.*${key}.*)\\/>`, "gi"); // e.g. <Header />
            const extractedCompArr = data.template.match(compRegex);
            if (Array.isArray(extractedCompArr) && extractedCompArr.length) {
              extractedCompArr.forEach(item => (data.template = data.template.replace(item, item.replace(this.attrRegex, ""))));
            }
          }
        }
      }

      debug("clean self-closing <Header/>", "groupCollapsed");
      debug(data.template);
      debug("", "groupEnd");

      // style
      data.style = data.style.replace(this.curlyRegex, `[data-pk="${sha}"]{`);

      debug("style", "groupCollapsed");
      debug(data.style);
      debug("", "groupEnd");

      return {
        template: data.template,
        style: data.style,
        sha,
      };
    } else {
      return {
        template: data.template,
        style: data.style,
        sha,
      };
    }
  }

  merge(data, ob) {
    let num = 0;
    ob.cb = {};
    ob.cb["view"] = () => data.render();

    // replace self-closing components with their actual markup
    if (data.components) {
      const compKeys = Object.keys(data.components);
      if (Array.isArray(compKeys) && compKeys.length) {
        for (let key in data.components) {
          // ignore current view
          if (key != data.name) {
            debug({
              view: data.name,
              comp: key,
            });
            num++;

            const compRegex = new RegExp(`<(.*${key}.*)\\/>`, "gi"); // detect components e.g. <Header/>
            const classComp = new data.components[key]();
            const comp = classComp.init();

            const extractedCompArr = ob.template.match(compRegex);
            if (Array.isArray(extractedCompArr) && extractedCompArr.length) {
              extractedCompArr.forEach(item => (ob.template = ob.template.replace(item, comp.template))); // merge html
            }

            ob.style += comp.style; // merge css
            ob.cb[`${key.toLowerCase()}_${num}`] = comp.cb["view"]; // merge js
          }
        }
      }
    }

    return ob;
  }
}

/**
 * a Base class for handling all shared services
 *
 * @property event
 * @method trigger
 * @example
 * trigger() // dispatches the event
 * event // refers to dispatched event name
 */
export class Service {
  constructor(name) {
    this.serviceEvent = new CustomEvent(name, {
      detail: {},
      bubbles: true,
      cancelable: true,
      composed: false,
    });
    this.event = name;
  }

  trigger() {
    dispatchEvent(this.serviceEvent);
  }
}