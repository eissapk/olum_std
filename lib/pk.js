/**
 * @author Eissa Saber <eissapk44@gmail.com>
 * @description A simple light weight library for providing spa experience
 * @version 1.0.0
 */

((factory) => {
  const global = typeof self !== "undefined" ? self : window;
  const lib = factory();
  if (typeof module === "object" && module.exports) module.exports = lib;
  else {
    global.Pk = lib.Pk;
    global.Origin = lib.Origin;
    global.Service = lib.Service;
    global.$ = lib.$;
    global.debug = lib.debug;
    global.setTemp = lib.setTemp;
  }
})(() => {
  "use strict";
  /**
   * helpers for optimizing the code
   */
  const debugStr = "Pk [warn]:";
  const quotes = str => "“" + str + "”";
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
   * @example $("#header") // returns 1st element
   * @example $("#header", true) // returns array
   * @example $(elm).get("li") // returns 1st li inside elm tag
   * @example $(elm).get("li", true) // returns array of li inside elm tag
   * @param {*} target can be class, id, tag or Element
   * @param {*} level (optional) boolean if omited it returns 1st element otherwise (true) returns array
   */
  const $ = (target, level, el = document) => {
    let elms;
    if (typeof target == "string") {
      elms = [].slice.call(el.querySelectorAll(target));
      if (elms.length) {
        if (level) return elms;
        else return elms[0];
      } else {
        return;
        console.error(`${debugStr} couldn't find ${quotes(target)} in dom!`);
      }
    } else {
      elms = target;
      if (elms && !Array.isArray(elms)) elms.get = (t, l) => $(t, l, elms);
      return elms;
    }
  };

  /**
   * A shorthand for addEventListener()
   *
   * @example btn.on("click", e => console.log(e))
   */
  function on(event, cb, propagation = false) {
    const hint = "@ on(event, cb, propagation)";
    try {
      if (typeof event != "string") {
        console.error(`${debugStr} ${quotes(event)} must be a string. ${hint}`);
      } else if (typeof cb != "function") {
        console.error(`${debugStr} ${quotes(cb)} not a function. ${hint}`);
      } else if (this == null) {
        console.error(`${debugStr} couldn't find  ${quotes(this.toString())} in dom! ${hint}`);
      } else if (typeof propagation != "boolean") {
        console.error(`${debugStr} ${quotes(propagation)} must be a boolean. ${hint}`);
      } else {
        return this.addEventListener(event.toLowerCase().trim(), e => cb(e), propagation);
      }
    } catch (err) {
      console.error(err);
    }
  }

  Element.prototype.on = on;
  Document.prototype.on = on;
  typeof self !== "undefined" ? self.on = on : window.on = on;

  /**
   * Replace markup (string) with matched values
   *
   * @example setTemp(`<div>{{name}}</div>`, {name:"pkjs"})
   * @param temp markup as string
   * @param obj object with all keys/values to be replaced with markup
   * @param delimit (optional) accepts array of string, default is ["{{", "}}"]
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
   * @param time (optional) transition timing
   * @see CSS must have `height: 0; overflow: hidden;`
   */
  Element.prototype.toggle = function (time = 0.3) {
    this.style.transition = `height ${time}s ease-in-out`;
    if (this.clientHeight == 0) {
      this.style.height = "auto";
      var toggleH = this.clientHeight + "px";
      this.style.height = "0";
      setTimeout(() => this.style.height = toggleH, 0);
    } else {
      this.style.height = "0";
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
  class Origin {
    constructor() {
      this.xhr = new XMLHttpRequest();
    }

    /**
     * Get data from server
     *
     * @example origin.get(url, {"Content-Type": "application/json"})
     *  .then(res => console.log(res))
     *  .catch(err => console.error(err))
     */
    get(url, data = {}) {
      return new Promise((resolve, reject) => {
        this.xhr.open("GET", url, true);
        for (let key in data) {
          if (key != "body") this.xhr.setRequestHeader(key, data[key]);
        }
        this.xhr.onreadystatechange = () => {
          if (this.xhr.readyState === 4) {
            if (this.xhr.status === 0 || this.xhr.status === 200) {
              try {
                resolve(JSON.parse(this.xhr.responseText));
              } catch (err) {
                resolve(this.xhr.responseText);
              }
            } else reject("Couldn't reach the server");
          }
        };
        this.xhr.onerror = () => reject("Network Error");
        this.xhr.send();
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
        this.xhr.open("POST", url, true);
        for (let key in data) {
          if (key == "body") {
            for (let key_ in data.body) {
              form.append(key_, data.body[key_]);
            }
          } else {
            this.xhr.setRequestHeader(key, data[key]);
          }
        }
        this.xhr.onreadystatechange = () => {
          if (this.xhr.readyState === 4) {
            if (this.xhr.status === 0 || this.xhr.status === 200) {
              try {
                resolve(JSON.parse(this.xhr.responseText));
              } catch (err) {
                resolve(this.xhr.responseText);
              }
            } else reject("Couldn't reach the server");
          }
        };
        this.xhr.onerror = () => reject("Network Error");
        this.xhr.send(form);
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
        this.xhr.open("DELETE", url, true);
        this.xhr.onreadystatechange = () => {
          if (this.xhr.readyState === 4) {
            if (this.xhr.status === 0 || this.xhr.status === 200) {
              resolve(JSON.parse(this.xhr.responseText));
            } else reject("Couldn't reach the server");
          }
        };
        this.xhr.onerror = () => reject("Network Error");
        this.xhr.send();
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
        this.xhr.open("PUT", url, true);
        this.xhr.setRequestHeader("Content-Type", "application/json");
        this.xhr.onreadystatechange = () => {
          if (this.xhr.readyState === 4) {
            if (this.xhr.status === 0 || this.xhr.status === 200) {
              resolve(JSON.parse(this.xhr.responseText));
            } else reject(`Couldn't reach the server`);
          }
        };
        this.xhr.onerror = () => reject("Network Error");
        this.xhr.send(JSON.stringify(data.body));
      });
    }
  }

  class Pk {
    routes = [];
    pushStateAPI = !!window.history.pushState;

    constructor({
      mode,
      root,
      el,
      prefix,
      routes
    }) {
      this.setMode(mode);
      this.setRoot(root);
      this.setPrefix(prefix);

      if (!this.hasRootElm(el)) {
        console.error(`${debugStr} couldn't find a value for ${quotes("el property")} @ router instance. \nmake sure it has the right selector e.g. el:"#app" \nand ${quotes("Root Element")} exists in dom e.g. <div id="app"></div>`);
      } else if (!this.hasRoutesArr(routes)) {
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

    hasRoutesArr(routes) {
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

    /**
     * Adds passedroute
     *
     * @example add("/", Home)
     * @param path accepts a string
     * @param comp accepts instance of component class
     */
    addRoute(path, comp) {
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
    delRoute(path) {
      this.routes.forEach(item => {
        if (item.path === path) delItem(this.routes, item);
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
      let defaultRoutes = ["", `${this.root}index.html`];
      window.on("popstate", () => {
        debug("Dispatched Popstate");
        this.current = this.getFragment();

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
            const b = this.getFragment();
            if (isSame(a, b)) return; // stop routing | preserve history from duplicated routes
            this.navigate(a); // navigate to clicked route
          });
        });
      }
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
        debug(["compsArr", compsArr]);

        // start tree
        const sequence = [...new Set([...compsArr.map(item => item.parent)])];
        debug(["sequence", sequence]);
        compsArr.forEach(item => tree.push([item.parent, item.child.name]));
        tree.forEach(arr => {
          const node = arr[0];
          sequence.forEach((parent, index) => {
            if (node === parent) {
              const placeholder = sequence
                .map((item, ind) => {
                  if (ind <= index) return item;
                })
                .filter(item => isDef(item));
              arr.splice(0, 1, ...placeholder);
            }
          });
        });
        debug([tree]);
        // end tree

        try {
          const label = isDev() ?
            this.label(entry, compsArr) : {
              entry,
              compsArr,
            }; // labeling components in dev mode
          const obj = this.merge(label);
          // html
          this.appMarkup.innerHTML = obj.template;
          // css
          this.appStyle.innerHTML = obj.style;
          // js
          setTimeout(() => {
            // make sure js runs last one to get the real markup values e.g height prop of a div
            for (let key in obj.script) obj.script[key]();
          }, 0);
          // devtool
          if (isDev())
            import("/devtool.js")
            .then(module => new module.default(this.appMarkup))
            .catch(err => console.warn(`${debugStr} Couldn't find  ${quotes("devtool extension")}\nplease download devtool.js file from official repo\n@ https://github.com/eissapk/pkjs/blob/develop/devtool.js\nand save it in the root of your project`));
        } catch (err) {
          console.error(err);
        }
      }
    }

    label(root, arr) {
      const attrRegex = /data-pk=\"([^"]*)\"|data-pk/gi; // detect -> data-pk="" | data-pk
      const compAttrRegex = /(pk-).*(-component)/gi; // detect -> pk-home-component
      const htmlComment = /\<\!\-\-(?:.|\n|\r)*?-->/gi; // detect ->  <!-- This is comment -->
      const openingTagRegex = /<[a-z]+(>|.*?[^?]>)/gi; // detect -> <tag> | <tag/>
      const greaterCharRegex = /\>/gi; // detect -> ">"
      let compsArr = [...arr];
      let entry = root;

      // compsArr
      compsArr.forEach(comp => {
        const name = hasProp(comp.child.data, "name") ? comp.child.data.name : "null";
        if (hasProp(comp.child.data, "template")) {
          // clean
          comp.child.data.template = comp.child.data.template.replace(attrRegex, "").replace(compAttrRegex, "").replace(htmlComment, "");
          // labeling
          const compWrapper = comp.child.data.template.match(openingTagRegex);
          if (isFullArr(compWrapper)) {
            comp.child.data.template = comp.child.data.template.replace(compWrapper[0], compWrapper[0].replace(greaterCharRegex, ` pk-component="${name}">`));
          }
        }
      });

      // entry
      if (entry.template) {
        const name = entry.name ? entry.name : "null";
        // clean
        entry.template = entry.template.replace(attrRegex, "").replace(compAttrRegex, "").replace(htmlComment, "");
        // labeling
        const compWrapper = entry.template.match(openingTagRegex);
        if (isFullArr(compWrapper)) {
          entry.template = entry.template.replace(compWrapper[0], compWrapper[0].replace(greaterCharRegex, ` pk-component="${name}" router-view="${name}">`));
        }
      }

      // root component
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
      let template = !!entry.template ? entry.template : "";
      let style = !!entry.style ? entry.style : "";
      let script = {};
      !!entry.render ? (script[0] = entry.render) : null;

      compsArr.forEach((comp, index) => {
        const data = comp.child.data;
        const html = !!data.template ? data.template : "";
        const css = !!data.style ? data.style : "";
        const js = !!data.render ? data.render : null;
        const name = this.prefix !== null ? this.prefix + "-" + data.name : data.name;
        const regex = new RegExp(`<(${name}\\s{0,})\\/>`, "gi"); // detect components e.g. <app-AddTodo />

        template = template.replace(regex, html);
        style += css;
        if (js != null) script[index + 1] = js;
      });

      return {
        template,
        style,
        script,
      };
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
      const links = $("[to]", true);
      if (isFullArr(links)) {
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
  class Service {
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

  return {
    Pk,
    Origin,
    Service,
    $,
    debug,
    setTemp,
  };

});