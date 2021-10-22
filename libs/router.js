/**
 * @name OlumRouter.js
 * @version 0.1.0
 * @copyright 2021
 * @author Eissa Saber
 * @license MIT
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else if (typeof define === "function" && define.amd) define(factory);
  else root.OlumRouter = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  /* helpers */
  var global = typeof self !== "undefined" ? self : this;
  var debugStr = "OlumRouter [warn]:";

  function isDef(val) {
    return (val !== undefined && val !== null);
  }

  function isDev() {
    return ["localhost", "127.0.0.1"].indexOf(global.location.hostname) !== -1;
  }

  function isObj(obj) {
    return (obj !== null && typeof obj === "object");
  }

  function isFullArr(arr) {
    return !!(isObj(arr) && Array.isArray(arr) && arr.length);
  }

  function isFullObj(obj) {
    return !!(isObj(obj) && Array.isArray(Object.keys(obj)) && Object.keys(obj).length);
  }

  function addProp(obj, key, val) {
    Object.defineProperty(obj, key, {
      value: val,
      writable: true,
      configurable: true,
    });
  }
  String.prototype.cap = function () {
    return this.toLowerCase().split(" ").map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  };

  function debug(args, level) {
    if (!isDef(level)) level = "log";
    level = level == "err" ? "error" : level;
    if (isDev()) Array.isArray(args) ? console[level].apply(console, args) : console[level](args);
  }

  function OlumRouter(config) {
    if (!(this instanceof OlumRouter)) throw new Error("can't invoke 'OlumRouter' without 'new' keyword");
    if (!config) throw new Error(debugStr + " Missing config object @OlumRouter");
    var $this = this;
    var routes = [];
    var root = "/";
    var mode = "hash";
    var pushStateAPI = global.history.pushState;
    var err = null;
    var isFrozen = false;
    var popStateEvent = null;
    var viewLoaded = null;
    this.routerIsReady = false;
    this.rootElm = null;
    this.prefix = null;
    mode = config && config.mode === "history" && pushStateAPI  ? "history" : "hash";
    root = config && config.root ? config.root : "/";
    err = config && config.err ? resolve(config.err) : null;
    
    this.freeze = function() {
      isFrozen = true;
    }
    
    this.unfreeze = function() {
      isFrozen = false;
    }
    
    this.getRoute = function() {
      var fragment = "";
      if (mode === "history") fragment = clear(decodeURIComponent(location.pathname));
      else if (mode === "hash") fragment = clear(decodeURIComponent(location.hash));
      return "/" + fragment;
    }
    
    function clear(str) {
      var regex = new RegExp("^[\#\/]{1,}|\/$", "g");
      str = String(str).toLowerCase().trim().replace(regex, "");
      return str;
    }

    function resolve(path) {
      var _root = clear(root);
      path = clear(path);
      path = (root !== "/") ? ("/" + _root + "/" + path) : ("/" + path);
      return path !== "/" ? path.replace(/\/$/g, "") : path;
    }
    
    function to() {
      var links = [].slice.call(document.querySelectorAll("[to]"));
      if (isFullArr(links)) {
        for (var i = 0; i<links.length; i++) {
          // disable href in anchor
          if (links[i].nodeName === "A") links[i].setAttribute("href", "javascript:void(0)");
          // onclick
          links[i].addEventListener("click", function(e) {
            var path = e.target.getAttribute("to");
            var _path_ = resolve(path);
            var current = $this.getRoute();
            if (_path_=== current) return; // stop routing | preserve history from duplicated routes
            navigate(path); // navigate to clicked route
          });
        }
      }
    }

    function active(path_b) {
      var links = [].slice.call(document.querySelectorAll("[to]"));
      if (isFullArr(links)) {
        for (var i = 0; i<links.length; i++){
          var path_a = resolve(links[i].getAttribute("to"));
          if (path_a === path_b) links[i].className += " active";
          else links[i].className = links[i].className.replace(/active/g,"");
        }
      }
    }
    
    function buildTree(entry) {
      var compsArr = [];

      function recursive(comp) {
        if (comp.hasOwnProperty("components") && isFullObj(comp.components)) {
          for (var key in comp.components) {
            var obj = {};
            addProp(obj, "parent", comp.name);
            addProp(obj, "child", {});
            addProp(obj.child, "name", key);
            var instance = new comp.components[key]();
            addProp(obj.child, "data", instance.data());
            compsArr.push(obj);

            if (obj.hasOwnProperty("child") && obj.child.hasOwnProperty("data")) {
              var nextEntry = obj.child.data;
              recursive(nextEntry);
            }
          }
        }
      };
      recursive(entry);
      return compsArr;
    }
    
    function merge(tree) {
      var entry = tree.entry;
      var compsArr = tree.compsArr;

      // parent (view) 
      var template = entry.template || "";
      var style = entry.style || "";
      var script = {};
      !!(entry.render) ? (script[0] = entry.render) : null;

      // children 
      if (isFullArr(compsArr)) {
        for(var i = 0; i < compsArr.length; i++) {
          var data = compsArr[i].child.data;
          var html = data.template || "";
          var css = data.style || "";
          var js = data.render || null;
          var name = $this.prefix ? $this.prefix + "-" + data.name : data.name;
          var regex = new RegExp("<(" + name + "\\s{0,})\\/>", "gi"); // detect components e.g. <App-AddTodo /> or <AddTodo />

          template = template.replace(regex, html);
          style += css;
          if (js !== null) script[i + 1] = js;
        }
      }

      return {
        template,
        style,
        script,
      };
    }
    
    function buildStyles(css) {
      var id = "olum_style_tag";
      var styleTag = document.getElementById(id);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = id;
        document.head.append(styleTag);
      }
      styleTag.innerHTML = css;
    }
    
    function mount(View) {
      if (!View || typeof View != "function") {
        throw new Error(debugStr + " Missing View argument @OlumRouter");
      } else {
        var view = new View();
        var entry = view.data();
        var compsArr = buildTree(entry);
        var viewObj = merge({ entry, compsArr });
        
        // css
        buildStyles(viewObj.style);
        // html
        $this.rootElm.innerHTML = viewObj.template;
        // js
        setTimeout(() => {
          active($this.getRoute()); // add active class to current route link tag
          to(); // enables to attribute e.g. <a to="/">Home</a>
          var scriptKeysArr = Object.keys(viewObj.script);
          function recursive (num) {
            viewObj.script[scriptKeysArr[num]]();
            if (num === scriptKeysArr.length - 1) {
              if (isDef($this.viewLoaded)) {
                dispatchEvent($this.viewLoaded);
                debug("viewLoaded");
              }
            }
            if (num + 1 <= scriptKeysArr.length - 1) recursive(num + 1);
          };
          recursive(0);
        }, 0);

      }
    }

    function addRoute(path, comp) {
      routes.push({ path: resolve(path), cb: function() { mount(comp) }});
    }
    
    function hasRoutes() {
      if (config && config.routes && isFullArr(config.routes)) {
        for (let i = 0; i < config.routes.length; i++) {
          addRoute(config.routes[i].path, config.routes[i].comp);
        }
        return true;
      }
      return false;
    }

    this.navigate = function (path) {
      $this.unfreeze();
      path = resolve(path);
      if (mode === "history") {
        global.history.pushState({}, "", path);
        debug("Pushed to history");
        dispatchEvent(popStateEvent);
      } else if (mode === "hash") {
        // todo enhance this part 
        if (root === "/") {
          location.href = location.href.replace(/\#.*/g, "")+"#"+path;
        } else {
          var _root = clear(root);
          _root = _root.replace(/\//g, "\\/");
          var rootRegex = new RegExp("\\/"+_root, "g");
          let _path = path.replace(rootRegex, "");
          _path = "/" + _path.replace(/^\//g, "");
          location.href = location.href.replace(/\#.*/g, "")+"#"+path;
        }
      }
    }

    this.listen = function() {
      global.addEventListener("popstate", function() {
        debug(["Dispatched Popstate", routes]);
        var current = $this.getRoute();
        var _root = "/" + clear(root);
        
        // todo enhance this part 
        current = (mode === "hash" && root !== "/") ? (current = _root + current).replace(/\/$/, "") : current;

        // todo replace find with es5
        var route = routes.find(function (_route) {
          if (_route.path === current) return _route;
          else if (current === "" || current === "/" || current.includes("index.html")) return _route.path === _root;
        });

        if (isDef(route)) {
          if (!isFrozen) route.cb(); // invokes mount(view)
        } else console.error(debugStr + " Unmached path @OlumRouter");
        
        // else {
        //   if (isDef(err)) {
        //     var err = routes.find(function (route){ return route.path === err});
        //     if (isDef(err)) {
        //       err.cb();
        //     } else {
        //       console.error(debugStr + " Unmached path @OlumRouter");
        //     }
        //   } else {
        //     $this.rootElm.innerHTML = "Not Found!";
        //   }
        // }

        debug({ current, route });

      });

      dispatchEvent(popStateEvent);
    }

    if (!hasRoutes()) {
      throw new Error(debugStr + " No routes found!");
    } else {
      popStateEvent = new PopStateEvent("popstate");
      viewLoaded = new CustomEvent("viewLoaded", { detail: {}, bubbles: true, cancelable: true, composed: false });
      this.routerIsReady = true;
    }
    
  }

  return OlumRouter;
});