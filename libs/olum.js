/**
 * @name Olum.js
 * @version 0.2.0
 * @copyright 2021
 * @author Eissa Saber
 * @license MIT
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else if (typeof define === "function" && define.amd) define(factory);
  else root.Olum = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  /* helpers */
  var global = typeof self !== "undefined" ? self : this;
  var debugStr = "Olum [warn]:";
  var isDebugging = true;

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
    if (isDebugging) Array.isArray(args) ? console[level].apply(console, args) : console[level](args);
  }

  function Olum(config) {
    if (!(this instanceof Olum)) throw new Error("can't invoke 'Olum' without 'new' keyword");
    var $this = this;
    
    // set defaults 
    var rootElm = null;
    var which = null;
    var prefix = config && config.prefix ? config.prefix : null;

    this.use = function (arg) {
      if (arg) {
        if (arg.constructor && arg.constructor.name === "OlumRouter") which = { type: "router", cb: arg };
        else if (arg.constructor && arg.constructor.name !== "") which = { type: "component", cb: arg };
        if (which) init();
        else throw new Error(debugStr + " Root component or router are not defined!");
      } else {
        throw new Error(debugStr + " Missing component or router @use()");
      }
    }

    this.$ = function (selector) {
      if (selector) {
        var delimiter;
        if (selector.indexOf(".") !== -1) delimiter = ".";
        else if (selector.indexOf("#") !== -1) delimiter = "#";
        selector = selector.replace(/\#|\./, "");
        rootElm =
          delimiter === "." ? document.getElementsByClassName(selector)[0] :
          delimiter === "#" ? document.getElementById(selector) :
          document.getElementsByTagName(selector)[0];
      } else {
        throw new Error(debugStr + " Root Element is not found in DOM!");
      }
      return this;
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

    function buildStyles(css) {
      var id = "olum_style_tag";
      var styleTag = document.getElementById(id);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = id;
        document.head.append(styleTag);
      }
      styleTag.innerHTML = css + "\n [to] * {pointer-events: none;}";
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
          var name = prefix ? prefix + "-" + data.name : data.name;
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

    function useComponent() {
      debug("use component");
      var view = new which.cb();
      var entry = view.data();
      var compsArr = buildTree(entry);
      var viewObj = merge({ entry: entry, compsArr: compsArr });

      // css
      buildStyles(viewObj.style);
      // html
      rootElm.innerHTML = viewObj.template;
      // js
      setTimeout(function () {
        for (var key in viewObj.script) {
          viewObj.script[key]();
        }
      }, 0);
    }
    
    function useRouter() {
      debug("use OlumRouter");
      var router = which.cb;
      // share core functionalites with router
      // props
      router.__proto__.rootElm = rootElm;
      // methods
      router.__proto__.buildTree = buildTree;
      router.__proto__.buildStyles = buildStyles;
      router.__proto__.merge = merge;
      
      if (router.isReady) router.listen();
    }
    
    function mount() {
      debug({mount:"mount()",rootElm, which});
      
      if (which && which.type && which.cb) {
        if (which.type === "router") useRouter();
        else if (which.type === "component") useComponent();
      } else {
        throw new Error(debugStr + " Can't mount, Missing component or router @use()");
      }
    }

    function init() {
      if (!rootElm) throw new Error(debugStr + " Root Element is not found in DOM!");
      else mount();
    }
    
  }

  return Olum;
});