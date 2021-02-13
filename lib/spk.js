/**
 * @author Eissa Saber <eissapk44@gmail.com>
 * @description A lightweight library for simplifying repetitive code
 * @version 0.1.6
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
          return console.log(
            "%c%s%c",
            "color:white; padding:3px 6px; border-radius:1px; background:#3392fa; margin: 0 5px 2px 0",
            "🥝 LOG",
            "",
            msg
          );
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
      debug('err', `on(event, cb, propagation): “${event}” must be a string.`);
    } else if (!events.includes(event.trim())) {
      debug('err', `on(event, cb, propagation): “${event}” not a valid event!`);
    } else if (typeof cb != "function") {
      debug('err', `on(event, cb, propagation): “${cb}” must be a function.`);
    } else if (!!this === false) {
      debug('err', `on(event, cb, propagation): couldn't find “${this}” in the dom!`);
    } else if (typeof propagation != "boolean") {
      debug('err', `on(event, cb, propagation): “${propagation}” must be a boolean.`);
    } else {
      event = event.toLowerCase().trim();
      return this.addEventListener(event, (e) => cb(e), propagation);
    }
  } catch (err) {
    debug('err', err);
  }
}

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
      debug('err', `on(event, cb, propagation): “${event}” must be a string.`);
    } else if (!events.includes(event.trim())) {
      debug('err', `on(event, cb, propagation): “${event}” not a valid event!`);
    } else if (typeof cb != "function") {
      debug('err', `on(event, cb, propagation): “${cb}” must be a function.`);
    } else if (typeof propagation != "boolean") {
      debug('err', `on(event, cb, propagation): “${propagation}” must be a boolean.`);
    } else {
      event = event.toLowerCase().trim();
      return this.addEventListener(event, (e) => cb(e), propagation);
    }
  } catch (err) {
    debug('err', err);
  }
}

/**
 * `string.upper()` convert a string to upper case
 */
String.prototype.upper = function () {
  return this.toUpperCase();
}

/**
 * `string.lower()` convert a string to lower case
 */
String.prototype.lower = function () {
  return this.toLowerCase();
}

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
    this.style.height = 'auto';
    const h = this.clientHeight + 'px'; // capture height
    this.style.height = '0';
    setTimeout(() => this.style.height = h, 0); // expand
  } else {
    this.style.height = '0'; // collapse
  }
}

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
      xhr.open('GET', url, true);

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
      xhr.onerror = () => reject('Network Error');

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
      xhr.open('POST', url, true);

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
      xhr.onerror = () => reject('Network Error');

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
      xhr.open('DELETE', url, true);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 0 || xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(`Couldn't reach the server`);
          }
        }
      };

      xhr.onerror = () => reject('Network Error');

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
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 0 || xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(`Couldn't reach the server`);
          }
        }
      };

      xhr.onerror = () => reject('Network Error');

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
  events = ["popstate", "DOMContentLoaded", "load"]

  constructor(options) {
    this.mode = window.history.pushState ? "history" : "hash";
    if (options.mode) this.mode = options.mode;
    if (options.root) this.root = options.root;
    this.listen();
  }

  /**
   * 
   * @param path for route e.g. "/about"
   * @param cb for initializing the component related to that route
   */
  add(path, cb) {
    this.routes.push({
      path,
      cb,
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

    this.events.forEach(event => window.addEventListener(event, () => {

      if (this.current === this.getFragment()) return;
      this.current = this.getFragment();

      const route = this.routes.find(item => {
        if (this.current === "") { // home page
          return item.path === "/";
        } else if (this.current === item.path) { // home page, other pages
          return item.path;
        } else { // not found page
          return item.path === "/404";
        }
      });
      if (typeof route != 'undefined') {
        route.cb();
        this.to();

        // add active class to current route
        const links = [].slice.call(document.querySelectorAll('[to]'));
        links.forEach(link => {
          if (this.clear(link.getAttribute('to')) === route.path) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

      }

      console.log({
        current: this.current
      });
      console.log(route);

    }));
    console.log("listen()");
  }

  /**
   * 
   * @param path for navigating the spa e.g "/about"
   */
  navigate(path = "") {
    if (this.mode === "history") {
      window.history.pushState(null, null, this.clear(path));
      const popStateEvent = new PopStateEvent('popstate');
      dispatchEvent(popStateEvent);
    } else {
      window.location.href = `${window.location.href.replace(/#(.*)$/,"")}#${this.clear(path)}`;
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
    console.log('to()');

    const links = [].slice.call(document.querySelectorAll('[to]'));
    if (links.length) {
      links.forEach(link => {
        if (link.nodeName === "A") {
          link.setAttribute("href", "javascript:void(0)");
        }

        // onclick
        link.addEventListener('click', e => {
          let attr = this.clear(e.target.getAttribute('to'));
          let current = this.getFragment();

          if (current === attr) return;
          this.navigate(attr);
        });

      });
    }
  }

}

/**
 * Reusable Components
 */
export const spk = {
  data: {
    init: `
      let num = 1;
      ob.cb = {};
      if (typeof this.components != "undefined" && Object.keys(this.components).length) {
        for (let key in this.components) {
          num++; 
          const pattern = new RegExp("<"+ key +"+(>|.*?[^?]>)", "gi"); // detect components e.g. <Header/>
          const instance = new this.components[key]().init();

          ob.template = ob.template.replace(pattern, instance.template); // merge html
          ob.style += instance.style; // merge css
          ob.cb[num] = instance.cb[1]; // merge js
        }
      }
      ob.cb[1] = () => this.render();
      `
  },
  methods: {
    scoped(template = "", style = "") {
      const attrRegex = /data-v=\"([^"]*)\"/gi; // detect this attribute ---- data-v=""
      const regex = /<[a-z]+(>|.*?[^?]>)/gi; // detect the opening tag ---- <tag>
      const sha = new Date().getTime(); // generate unique sha

      //* HTML
      template = template.replace(attrRegex, ""); // clean
      // replace
      const arr = template.match(regex);
      if (arr.length) arr.forEach(item => template = template.replace(item, item.replace(/\>/, ` data-v="${sha}">`)));

      //* CSS
      style = style.replace(/\s*\{/g, `[data-v="${sha}"]{`);

      return {
        template,
        style,
        sha
      };
    },
    nonScoped(template = "", style = "") {
      return {
        template,
        style
      };
    },
    component(Name) {
      const root = document.getElementById("root");
      if (!!root && typeof Name == "function") {
        const comp = new Name().init();

        debug(comp);

        if (Object.keys(comp).length && comp.template && comp.style && comp.cb && comp.sha) {
          root.innerHTML = comp.template; // inject html

          //! inject css
          const styles = document.querySelectorAll(`style[id^="__comp__"]`);
          if (styles.length) styles.forEach((item) => item.remove());
          root.insertAdjacentHTML("afterend", `<style id="__comp__${comp.sha}">${comp.style}</style>`);

          for (let key in comp.cb) { // run js
            comp.cb[key]();
          }

        } else {
          debug(`Component object doesn't have props: (template, style, sha, cb)`);
        }

      }

    }
  }
};

/**
 * syntax highlighting
 */
const lit = (s, ...args) => s.map((ss, i) => `${ss}${args[i] || ''}`).join('');
export const css = lit;
export const html = lit;