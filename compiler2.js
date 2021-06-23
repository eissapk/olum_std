#!/usr/bin/env node
const commander = require("commander");
const cmd = new commander.Command();
const sass = require("sass");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const fs = require("fs");
const extra = require("fs-extra");
const path = require("path");
const colors = require("colors");
const settings = require("./settings");

// helpers
const isDebugging = true;
const debugLib = arg => (isDebugging ? console.log(arg) : "");
const quotes = (msg, color = "grey") => `'${colors[color].bold(msg)}'`;
const log = (type, path, err) => quotes(`${type} : ${path.replace(this.sub, "src")}`, "white") + "\n" + colors.red.bold(err);
const isObj = obj => !!(obj !== null && typeof obj === "object");
const isFullArr = arr => !!(isObj(arr) && Array.isArray(arr) && arr.length);
const isDef = val => !!(val !== undefined && val !== null);
const flatten = lists => lists.reduce((a, b) => a.concat(b), []);
const mkRegex = arr => {
  const pattern = arr.map(str => `${str.toLowerCase().trim()}|`).join("").slice(0, -1);
  const regex = new RegExp(pattern, "gi");
  return regex;
};

class Compiler {
  viewsDirs = ["components", "views"];
  sub = settings.src;
  regex = {
    template: {
      all: /<template[\s\S]*?>[\s\S]*?<\/template>/gi,
      tag: /<template[\s\S]*?>|<\/template>/gi,
    },
    script: {
      all: /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      tag: /<script[\s\S]*?>|<\/script>/gi,
      curlyAfterClass: /(?<=export.*class.*)(\{)/,
    },
    style: {
      all: /<style[\s\S]*?>[\s\S]*?<\/style>/gi,
      tag: /<style[\s\S]*?>|<\/style>/gi,
      openTag: /<style[\s\S]*?>/gi,
    },
  };

  constructor() {
    // cmd.command("clean").action(this.clean.bind(this));
    // cmd.command("copy").action(this.copy.bind(this));
    // cmd.command("compile").action(this.init.bind(this));
    // cmd.parse(process.argv);
  }

  // hasSASS(style) {
  //   const regex = new RegExp("lang=['\"]scss|sass['\"]", "gi");
  //   const openTagArr = style.match(this.regex.style.openTag);
  //   const openTag = Array.isArray(openTagArr) && openTagArr.length ? openTagArr[0] : "";
  //   return regex.test(openTag);
  // }

  // css(file, shared) {
  //   const styleArr = file.match(this.regex.style.all);
  //   let style = Array.isArray(styleArr) && styleArr.length ? styleArr[styleArr.length - 1] : ""; // get last style tag as the order of the component file cause you may have style tag inside the class "script tag"
  //   const scss = style.replace(this.regex.style.tag, "");
  //   const compiledShared = sass.renderSync({ data: shared }).css.toString();
  //   const css = this.hasSASS(style) ? sass.renderSync({ data: shared + scss }).css.toString() : compiledShared + scss;
  //   // prefix css
  //   postcss([autoprefixer])
  //     .process(css, { from: undefined })
  //     .then(result => {
  //       result.warnings().forEach(warn => console.warn(warn.toString()));
  //       const finalStyle = "\n style() { \n return `" + result.css + "`;\n}\n";
  //       console.log(colors.green(finalStyle));
  //     });
  //   return "\n style() { \n return `" + css + "`;\n}\n";
  // }











  getPaths(base) {
    return new Promise((resolve, reject) => {
      const dirs = src => fs.readdirSync(src).map(item => path.join(src, item)).filter(item => fs.statSync(item).isDirectory());
      const recursive = src => [src, ...flatten(dirs(src).map(recursive))];
      const arr = recursive(base);
      
      // get all dirs 
      const directories = [...arr].filter(item => {
          const regex = mkRegex(this.viewsDirs);
          const result = regex.test(item);
          if (result) return item;
      }).map(item => item.trim().replace(/^src/, this.sub));
      if (!isFullArr(directories)) return reject("No directories found !");
      const lastDir = directories[directories.length-1];

      // get all files 
      this.paths = [];
      directories.forEach((dir, index) => {
        fs.readdir(path.resolve(__dirname, dir), (err, files) => {
          if (err) return reject(err);
          
          files.forEach((file, ind) => {
            const lastFile = files[files.length-1];
            const item = path.join(dir, file);
            if (!fs.statSync(item).isDirectory()) this.paths.push(item); // push files only and exclude directories
            if (directories.indexOf(lastDir) === index && files.indexOf(lastFile) === ind) {
              const msg = `Created ${quotes("Paths", "blue")} Array.`;
              debugLib(msg);
              resolve();
            }
          });
          
        });
      });

    });
  }

  // solve if folder doesn't exist
  clean() {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this.sub)) { // if folder exists
        extra.remove(path.resolve(__dirname, this.sub), err => {
          if (err) return reject(err);
          const msg = `Deleted ${quotes(this.sub, "red")} Directory.`;
          debugLib(msg);
          resolve();
        });
      } else resolve();
    });
  }

  copy() {
    return new Promise((resolve, reject) => {
      extra.copy(path.resolve(__dirname, "src"), path.resolve(__dirname, this.sub), err => {
        if (err) return reject(err);
        const msg = `Copied & renamed ${quotes("src", "green")} Directory → ${quotes(this.sub, "yellow")}`;
        debugLib(msg);
        resolve();
      });
    });
  }

  sharedStyle() {
    const file = path.resolve(__dirname, "src/styles/shared.scss");
    return new Promise((resolve, reject) => {
      if (fs.existsSync(file)) {
        fs.readFile(file, "utf8", (err, data) => {
          if (err) return reject(err);
          const msg = `Copied ${quotes("shared", "green")} Style.`;
          debugLib(msg);
          resolve(data.trim());
        });
      } else {
        resolve("");
      }
    });
  }

  css(file, data, shared) {
    return new Promise((resolve, reject) => {
      const styleArr = data.match(this.regex.style.all);
      const style = isFullArr(styleArr) ? styleArr[styleArr.length - 1] : ""; // get last style tag as the order of component file | because you may have style tag inside the class "script tag"
      const scss = style.replace(this.regex.style.tag, "");
      
      try {
        // compile sass to css 
        const css = sass.renderSync({ data: shared + scss }).css.toString();
        // prefix compiled css
        postcss([autoprefixer]).process(css, { from: undefined }).then(result => {
          result.warnings().forEach(warn => console.warn(colors.yellow.bold(warn.toString())));
          const finalStyle = "\n style() { \n return `" + result.css + "`;\n}\n";
          resolve(finalStyle);
        }).catch(err => reject(log("PostCSS Compiler", file, err.reason + "\n" + err.showSourceCode())));
      
      } catch (err) { // error related to Sass
        reject(log("Sass Compiler", file, err));
      }
    });
  }

  html(data) {
    return new Promise(resolve => {
      const tempArr = data.match(this.regex.template.all);
      const template = isFullArr(tempArr) ? tempArr[0] : ""; // get 1st template tag as the order of component file
      const markup = template.replace(this.regex.template.tag, "");
      const html = "\n template() { \n return `" + markup + "`;\n}\n";
      resolve(html);
    });
  }

  js(file, data) {
    return new Promise((resolve, reject) => {
      const scriptArr = data.match(this.regex.script.all);
      const script = isFullArr(scriptArr) ? scriptArr[0] : ""; // get 1st script tag as the order of component file
      const js = script.replace(this.regex.script.tag, "");
      const hasJsClass = this.regex.script.curlyAfterClass.test(js);
      if (hasJsClass) resolve(js);
      else reject(log("JS Class", file, "Couldn't find a class or opening curly bracket e.g. class Example '{' is followed with code"));
    });
  }

  modifyPath(file) {
    const arr = file.split(".");
    const ext = arr[arr.length - 1];
    return file.replace(ext, "") + "js";
  }
  





  // removeFile(dir, file) {
  //   extra.remove(path.resolve(__dirname, dir, file), err => {
  //     if (err) return console.error(colors.red.bold(err));
  //     debugLib(colors.yellow.bold(`Removed "${file}"`));
  //   });
  // }



  createFile(newPath, compiledFile) {
    fs.writeFile(newPath, compiledFile, err => {
      if (err) return console.error(colors.red.bold(err));
      debugLib(colors.blue.bold(`Created: "${path.basename(newPath)}"`));
    });
  }

  update(shared) {
    if (isDef(this.paths) && isFullArr(this.paths)) {
      const recursive = num => {
        const file = this.paths[num].trim();
        const newPath = this.modifyPath(file);
        fs.readFile(file, "utf8", (err, data) => {
          if (err) return console.error(colors.red.bold(err));

          (async () => {
            try {
              const css = await this.css(file, data, shared);
              const js = await this.js(file, data);
              const html = await this.html(data);

              const compiledFile = js.replace(this.regex.script.curlyAfterClass, "{" + html + css);
              
              console.warn(compiledFile);
              
              // this.createFile(newPath, compiledFile);
              // this.removeFile(dir, file);





              if (num + 1 <= this.paths.length - 1) recursive(num + 1); // next
            } catch (err) {
              console.error(err);
            }
          })();

        });
      };
      recursive(0);
    } else {
      const msg = `No ${quotes("components", "red")} to compile.`;
      console.warn(msg);
    }
  }

  async init() {
    try {
      await this.getPaths("src");
      await this.clean();
      await this.copy();
      const shared = await this.sharedStyle();
      this.update(shared);
    } catch (err) {
      console.error(colors.red.bold(err));
    }
  }
}

new Compiler().init();




// var result = sass.renderSync({
//   data: `
// @use "sass:math";

// h1 {
//   font-size: math.div(100px, 3);
// }`,
//   precision: 20
// });

// console.log(result.css.toString());
// // h1 {
// //  font-size: 33.333333333333336px; }